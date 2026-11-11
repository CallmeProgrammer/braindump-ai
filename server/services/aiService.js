
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

/*
========================================
ENVIRONMENT CONFIGURATION
========================================
*/

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error(
    "GEMINI_API_KEY is missing from server/.env"
  );
}

/*
========================================
GEMINI CLIENT
========================================
*/

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

/*
========================================
ALLOWED CATEGORIES
========================================
*/

const ALLOWED_CATEGORIES = [
  "Work",
  "Personal",
  "Study",
  "Health",
  "Finance",
  "Shopping",
  "Other",
];

/*
========================================
ALLOWED PRIORITIES
========================================
*/

const ALLOWED_PRIORITIES = [
  "High",
  "Medium",
  "Low",
];

/*
========================================
GEMINI MODEL CONFIGURATION
========================================

Models are attempted in order.

Each model receives up to 2 attempts
for temporary availability errors.

========================================
*/

const GEMINI_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.6-flash",
  "gemini-3.7-flash",
];

const MAX_RETRIES = 2;

const RETRY_DELAY = 1500;

/*
========================================
WAIT HELPER
========================================
*/

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

/*
========================================
ERROR STATUS HELPER
========================================
*/

function getErrorStatus(error) {
  return Number(
    error?.status ||
    error?.code ||
    error?.response?.status ||
    0
  );
}

/*
========================================
TEMPORARY ERROR CHECK
========================================
*/

function isTemporaryError(error) {
  const status = getErrorStatus(error);

  return [
    429,
    500,
    502,
    503,
    504,
  ].includes(status);
}

/*
========================================
GENERATE CONTENT WITH FALLBACK
========================================

1. Try the primary model.
2. Retry temporary failures.
3. Try the next model.
4. Return a readable error if all models fail.

========================================
*/

async function generateWithFallback(prompt) {
  let lastError = null;

  for (const model of GEMINI_MODELS) {
    console.log(
      `\nTrying Gemini model: ${model}`
    );

    for (
      let attempt = 1;
      attempt <= MAX_RETRIES;
      attempt++
    ) {
      try {
        console.log(
          `Attempt ${attempt}/${MAX_RETRIES}`
        );

        const response =
          await ai.models.generateContent({
            model,

            contents: prompt,

            config: {
              responseMimeType:
                "application/json",
            },
          });

        if (!response || !response.text) {
          throw new Error(
            "Gemini returned an empty response."
          );
        }

        console.log(
          `Gemini successfully responded using ${model}`
        );

        return response;
      } catch (error) {
        lastError = error;

        const status =
          getErrorStatus(error);

        console.error(
          `Gemini failed using ${model}`
        );

        console.error(
          "Status:",
          status
        );

        console.error(
          "Message:",
          error.message
        );

        /*
        --------------------------------
        TEMPORARY ERRORS
        --------------------------------

        Retry temporary errors.

        If retries are exhausted,
        move to the next model.
        */

        if (isTemporaryError(error)) {
          if (
            attempt < MAX_RETRIES
          ) {
            console.log(
              `Retrying ${model}...`
            );

            await wait(RETRY_DELAY);

            continue;
          }

          console.log(
            `${model} unavailable. Trying fallback model.`
          );

          break;
        }

        /*
        --------------------------------
        MODEL NOT FOUND
        --------------------------------

        A 404 may mean the model is
        unavailable for this project.

        Skip it and try the next model.
        */

        if (status === 404) {
          console.log(
            `${model} not found. Skipping model.`
          );

          break;
        }

        /*
        --------------------------------
        AUTHENTICATION ERRORS
        --------------------------------

        Do not retry invalid API keys
        or permission errors.
        */

        if (
          status === 401 ||
          status === 403
        ) {
          throw new Error(
            "Gemini authentication failed. Check your GEMINI_API_KEY and API permissions."
          );
        }

        /*
        --------------------------------
        OTHER ERRORS
        --------------------------------
        */

        throw error;
      }
    }
  }

  /*
  ========================================
  ALL MODELS FAILED
  ========================================
  */

  console.error(
    "All Gemini models failed."
  );

  if (lastError) {
    console.error(
      "Last Gemini error:",
      lastError.message
    );
  }

  const finalError = new Error(
    "Gemini is temporarily unavailable. Please try again later."
  );

  finalError.status = 503;

  throw finalError;
}

/*
========================================
PROCESS BRAIN DUMP
========================================

Receives unstructured user text.

Returns organized tasks.

========================================
*/

export async function processBrainDump(text) {
  /*
  ========================================
  VALIDATE INPUT
  ========================================
  */

  if (
    !text ||
    typeof text !== "string" ||
    !text.trim()
  ) {
    throw new Error(
      "Brain dump text is required."
    );
  }

  /*
  ========================================
  CURRENT DATE
  ========================================
  */

  const today = new Date()
    .toISOString()
    .split("T")[0];

  /*
  ========================================
  AI PROMPT
  ========================================
  */

  const prompt = `
You are BrainDump AI, an intelligent productivity assistant.

Today's date is ${today}.

The user will provide an unstructured brain dump containing thoughts,
responsibilities, reminders, plans, ideas, and things they need to accomplish.

Convert the useful actionable items into organized tasks.

RULES:

1. Extract only actionable tasks.

2. Ignore casual thoughts and filler.

3. Break large responsibilities into separate useful tasks when appropriate.

4. Keep task titles short, specific, and actionable.

5. Preserve important details from the user's original text.

6. Do not invent information.

7. Do not invent deadlines.

8. If the user provides a date, convert it to YYYY-MM-DD.

9. If the user uses a relative date such as "tomorrow",
calculate it using today's date.

10. If there is no reasonable due date, use an empty string.

11. Choose exactly one category:

Work, Personal, Study, Health, Finance, Shopping, Other.

12. Choose exactly one priority:

High, Medium, Low.

13. High means urgent, important, deadline-sensitive, or blocking.

14. Medium means important but not immediately urgent.

15. Low means optional or can wait.

16. Avoid duplicate tasks.

17. Do not create tasks that are not supported by the user's text.

18. Keep descriptions concise and useful.

19. Return a valid JSON object.

20. Do not include Markdown code fences.

RETURN ONLY JSON:

{
  "tasks": [
    {
      "title": "Task title",
      "description": "Task details",
      "category": "Work",
      "priority": "High",
      "dueDate": "YYYY-MM-DD"
    }
  ]
}

If there is no due date:

"dueDate": ""

USER BRAIN DUMP:

${text.trim()}
`;

  /*
  ========================================
  GENERATE AI RESPONSE
  ========================================
  */

  const response =
    await generateWithFallback(prompt);

  /*
  ========================================
  EXTRACT RESPONSE
  ========================================
  */

  const output = response.text;

  if (
    !output ||
    typeof output !== "string"
  ) {
    throw new Error(
      "Gemini returned an empty response."
    );
  }

  /*
  ========================================
  PARSE JSON
  ========================================
  */

  let parsed;

  try {
    parsed = JSON.parse(output);
  } catch (error) {
    console.error(
      "Gemini returned invalid JSON:",
      output
    );

    throw new Error(
      "AI returned an invalid response. Please try again."
    );
  }

  /*
  ========================================
  VALIDATE RESPONSE STRUCTURE
  ========================================
  */

  if (
    !parsed ||
    !Array.isArray(parsed.tasks)
  ) {
    throw new Error(
      "AI returned an invalid task structure."
    );
  }

  /*
  ========================================
  NORMALIZE GENERATED TASKS
  ========================================
  */

  const tasks = parsed.tasks
    .filter(
      (task) =>
        task &&
        typeof task.title === "string" &&
        task.title.trim()
    )
    .map((task) => {
      /*
      --------------------------------
      CATEGORY
      --------------------------------
      */

      const category =
        ALLOWED_CATEGORIES.includes(
          task.category
        )
          ? task.category
          : "Other";

      /*
      --------------------------------
      PRIORITY
      --------------------------------
      */

      const priority =
        ALLOWED_PRIORITIES.includes(
          task.priority
        )
          ? task.priority
          : "Medium";

      /*
      --------------------------------
      DESCRIPTION
      --------------------------------
      */

      const description =
        typeof task.description === "string"
          ? task.description.trim()
          : "";

      /*
      --------------------------------
      DUE DATE
      --------------------------------
      */

      const dueDate =
        typeof task.dueDate === "string"
          ? task.dueDate.trim()
          : "";

      /*
      --------------------------------
      RETURN NORMALIZED TASK
      --------------------------------
      */

      return {
        title: task.title.trim(),

        description,

        category,

        priority,

        dueDate,
      };
    });

  /*
  ========================================
  RETURN TASKS
  ========================================
  */

  console.log(
    `BrainDump AI generated ${tasks.length} tasks.`
  );

  return tasks;
}
