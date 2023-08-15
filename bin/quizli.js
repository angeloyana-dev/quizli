#!/usr/bin/env node
import termkit from "terminal-kit";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import gradient from "gradient-string";
import select from "cli-select";
import { createSpinner } from "nanospinner";
import he from "he";
import boxen from "boxen";
import shell from "shelljs";
import prompt from "prompts";

const term = termkit.terminal;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Starter
shell.exec("clear");
await mainMenu(true);

// Main Page
async function mainMenu(startType) {
  await new Promise((resolve) => {
    figlet("Quizli", async (err, heading) => {
      if (startType) {
        const rainbowHeading = chalkAnimation.rainbow(heading);
        await sleep(2000);
        rainbowHeading.stop();
      }
      shell.exec("clear");
      term(gradient.pastel.multiline(heading));
      await sleep(550);
      resolve();
    });
  });

  // Action options
  term("\n\n");
  term.cyan.bold(" Welcome to Quizli!\n");
  const action = await select({
    values: [
      { value: 0, label: "Quick Start" },
      { value: 1, label: "Customize" },
      { value: 2, label: "About" },
      { value: 3, label: "Exit" },
    ],
    valueRenderer: (value, selected) =>
      selected ? chalk.yellow.bold(value.label) : chalk.dim(value.label),
    selected: chalk.yellow.bold(" ->"),
    unselected: "  ",
  });

  // Trigger action
  switch (action.id) {
    case 0:
      fetchQuestions(false);
      break;
    case 1:
      shell.exec("clear");
      customizeQuestionsPage();
      break;
    case 2:
      shell.exec("clear");
      await sleep(500);
      aboutPage();
      break;
    case 3:
      shell.exec("clear");
      term(`Selected - ${action.value.label}\n`);
      process.exit(0);
      break;
  }
}

// Customization page
async function customizeQuestionsPage() {
  await new Promise((resolve) => {
    figlet("Customize", async (err, heading) => {
      term(gradient.pastel.multiline(heading));
      await sleep(50);
      resolve();
    });
  });

  term("\n\n");
  const questionAmount = await prompt({
    name: "value",
    type: "number",
    message: "Total Questions Number: ",
    validate: (value) =>
      value <= 0 || value > 51 ? chalk.red("Invalid amount...") : true,
  });

  term("\n\n");
  term.cyan.bold("  Difficulty:\n");
  const questionDifficulty = await select({
    values: [
      { value: false, label: "Random" },
      { value: "easy", label: "Easy" },
      { value: "medium", label: "Medium" },
      { value: "hard", label: "Hard" },
    ],
    valueRenderer: (value, selected) => {
      if (selected) {
        if (value.value === false) return chalk.white.bold(value.label);
        if (value.value === "easy") return chalk.green.bold(value.label);
        if (value.value === "medium") return chalk.yellow.bold(value.label);
        if (value.value === "hard") return chalk.red.bold(value.label);
      }
      return chalk.dim(value.label);
    },
    selected: " ->",
    unselected: "  ",
  });

  term("\n\n");
  term.cyan.bold("  Question Type\n");
  const questionType = await select({
    values: [
      { value: false, label: "Random" },
      { value: "multiple", label: "Multiple choices" },
      { value: "boolean", label: "True or false" },
    ],
    valueRenderer: (value, selected) =>
      selected ? chalk.yellow.bold(value.label) : value.label,
    selected: chalk.yellow.bold(" ->"),
    unselected: "  ",
  });

  term("\n\n");
  term.cyan.bold("  Category:\n");
  const questionCategory = await select({
    values: [
      { value: false, label: "Random" },
      { value: 9, label: "General Knowledge" },
      { value: 10, label: "Entertainment: Books" },
      { value: 11, label: "Entertainment: Film" },
      { value: 12, label: "Entertainment: Music" },
      { value: 13, label: "Entertainment: Musicals & Theatres" },
      { value: 14, label: "Entertainment: Television" },
      { value: 15, label: "Entertainment: Video Games" },
      { value: 16, label: "Entertainment: Board Games" },
      { value: 17, label: "Science & Nature" },
      { value: 18, label: "Science: Computers" },
      { value: 19, label: "Science: Mathematics" },
      { value: 20, label: "Mythology" },
      { value: 21, label: "Sports" },
      { value: 22, label: "Geography" },
      { value: 23, label: "History" },
      { value: 24, label: "Politics" },
      { value: 25, label: "Art" },
      { value: 26, label: "Celebrities" },
      { value: 27, label: "Animals" },
      { value: 28, label: "Vehicles" },
      { value: 29, label: "Entertainment: Comics" },
      { value: 30, label: "Science: Gadgets" },
      { value: 31, label: "Entertainment: Japanese Anime & Manga" },
      { value: 32, label: "Entertainment: Cartoon & Animations" },
    ],
    valueRenderer: (value, selected) =>
      selected ? chalk.yellow.bold(value.label) : value.label,
    selected: chalk.yellow.bold(" ->"),
    unselected: "  ",
  });

  const queries = [];
  queries.push(`amount=${questionAmount.value}`);
  if (questionDifficulty.value.value)
    queries.push(`difficulty=${questionDifficulty.value.value}`);
  if (questionType.value.value)
    queries.push(`type=${questionType.value.value}`);
  if (questionCategory.value.value)
    queries.push(`category=${questionCategory.value.value}`);
  const urlEncodedQueries = queries.join("&");

  shell.exec("clear");
  await new Promise((resolve) => {
    figlet("Customize", async (err, heading) => {
      term(gradient.pastel.multiline(heading));
      await sleep(50);
      resolve();
    });
  });

  term("\n\n");
  term(`
  ${chalk.cyan.bold("Is this your final customization:")}
  ${chalk.bold("Amount - ")}${chalk.green.bold(questionAmount.value)}
  ${chalk.bold("Difficulty - ")}${chalk.green.bold(
    questionDifficulty.value.label
  )}
  ${chalk.bold("Question type - ")}${chalk.green.bold(questionType.value.label)}
  ${chalk.bold("Category - ")}${chalk.green.bold(
    questionCategory.value.label
  )}\n\n`);

  const action = await select({
    values: [
      { value: 0, label: "Yes" },
      { value: 1, label: "Change" },
      { value: 2, label: "Main menu" },
      { value: 3, label: "Exit" },
    ],
    valueRenderer: (value, selected) =>
      selected ? chalk.yellow.bold(value.label) : chalk.dim(value.label),
    selected: chalk.yellow.bold(" ->"),
    unselected: "  ",
  });

  // Trigger action
  switch (action.id) {
    case 0:
      fetchQuestions(urlEncodedQueries);
      break;
    case 1:
      shell.exec("clear");
      customizeQuestionsPage();
      break;
    case 2:
      shell.exec("clear");
      mainMenu();
      break;
    case 3:
      shell.exec("clear");
      term(`Selected - ${action.value.label}\n`);
      process.exit(0);
      break;
  }
}

// Show about page
async function aboutPage() {
  await new Promise((resolve) => {
    figlet("About Quizli", async (err, heading) => {
      term(gradient.pastel.multiline(heading));
      await sleep(50);
      resolve();
    });
  });

  const message = `Hi! Im ${chalk.bold(
    "Angelo Yana"
  )}, the developer of this app. So basically this is just a simple ${chalk.bold(
    "Quiz App"
  )} but in command line.\n\nQuestions was fetched from\n${chalk.cyan.bold(
    "Visit here - https://opentdb.com"
  )}\n\nCopyright @2023 Angelo Yana. All rights reserved.`;
  term(
    boxen(message, {
      title: "Developer",
      titleAlignment: "center",
      borderStyle: "double",
      borderColor: "dim",
      padding: 2,
      margin: 3,
    })
  );

  // Actions
  const action = await select({
    values: [
      { value: 0, label: "Go back" },
      { value: 1, label: "Exit" },
    ],
    valueRenderer: (value, selected) =>
      selected ? chalk.yellow.bold(value.label) : chalk.dim(value.label),
    selected: chalk.yellow.bold("  ->"),
    unselected: "   ",
  });

  switch (action.id) {
    case 0:
      shell.exec("clear");
      mainMenu();
      break;
    case 1:
      shell.exec("clear");
      term(`Selected - ${action.value.label}\n`);
      process.exit(0);
      break;
  }
}

// Fetching query from API
async function fetchQuestions(queries) {
  const preloader = createSpinner("Preparing question");
  preloader.start();
  try {
    const res = await fetch(
      queries
        ? `https://opentdb.com/api.php/?${queries}`
        : "https://opentdb.com/api.php?amount=10"
    );
    const data = await res.json();
    if (!data.results[0]) {
      preloader.error();
      await sleep(100);
      return handleEmptyResponse();
    }
    // Procedure if success
    await sleep(500);
    preloader.success();
    shell.exec("clear");
    await new Promise((resolve, reject) => {
      figlet("Ready?", async (err, heading) => {
        if (err) reject();
        term(gradient.pastel.multiline(heading));
        term("\n");
        resolve();
      });
    });

    // Getting ready action
    term.cyan.bold(" Are you ready?\n");
    const action = await select({
      values: [
        { value: 0, label: "Yes" },
        { value: 1, label: "Main menu" },
      ],
      valueRenderer: (value, selected) =>
        selected ? chalk.yellow.bold(value.label) : chalk.dim(value.label),
      selected: chalk.yellow.bold(" ->"),
      unselected: "  ",
    });

    // Trigger action
    switch (action.id) {
      case 0:
        prepareQuestions(data.results, queries);
        break;
      case 1:
        shell.exec("clear");
        mainMenu();
        break;
    }
  } catch (err) {
    // Actions if error fetching
    preloader.error();
    await sleep(500);
    shell.exec("clear");
    await new Promise((resolve) => {
      figlet("Error", async (err, heading) => {
        term(gradient.passion.multiline(heading));
        await sleep(500);
        resolve();
      });
    });
    term(gradient.passion.multiline(`\n Something went wrong,\n`));
    term(gradient.passion.multiline(" Please try again or restart.\n"));

    // Optional actions to try again
    const action = await select({
      values: [
        { value: 0, label: "Try Again" },
        { value: 1, label: "Main menu" },
        { value: 2, label: "Exit" },
      ],
      valueRenderer: (value, selected) =>
        selected ? chalk.yellow.bold(value.label) : chalk.dim(value.label),
      selected: chalk.yellow.bold(" ->"),
      unselected: "  ",
    });

    // Trigger action
    switch (action.id) {
      case 0:
        shell.exec("clear");
        fetchQuestions(queries);
        break;
      case 1:
        shell.exec("clear");
        mainMenu();
        break;
      case 2:
        shell.exec("clear");
        term(`Selected - ${action.value.label}\n`);
        process.exit(0);
        break;
    }
  }
}

// Handle empty response
async function handleEmptyResponse() {
  shell.exec("clear");
  await new Promise((resolve) => {
    figlet("404\nNot found!", async (err, heading) => {
      term(gradient.passion.multiline(heading));
      await sleep(500);
      resolve();
    });
  });

  const message =
    "We're sorry for the inconvenience, the options you picked is not available please try to use another options.";
  term(
    gradient.passion.multiline(
      boxen(message, {
        borderStyle: "double",
        padding: 2,
        margin: 3,
      })
    )
  );

  const action = await select({
    values: [
      { value: 0, label: "Customize" },
      { value: 1, label: "Main menu" },
      { value: 2, label: "Exit" },
    ],
    valueRenderer: (value, selected) =>
      selected ? chalk.yellow.bold(value.label) : chalk.dim(value.label),
    selected: chalk.yellow.bold(" ->"),
    unselected: "  ",
  });

  // Trigger action
  switch (action.id) {
    case 0:
      shell.exec("clear");
      customizeQuestionsPage();
      break;
    case 1:
      shell.exec("clear");
      mainMenu();
      break;
    case 2:
      shell.exec("clear");
      term(`Selected - ${action.value.label}\n`);
      process.exit(0);
      break;
  }
}

// Questions Preperations
function prepareQuestions(rawQuestions, queries) {
  // Decodes raw questions
  const decodedQuestion = rawQuestions.map((question) => {
    const choices = (() => {
      const rawChoices = question.incorrect_answers.concat(
        he.decode(question.correct_answer)
      );
      const sortedChoices = rawChoices.sort(() => Math.random() - 0.5);
      const decodedChoices = sortedChoices.map((choice) => he.decode(choice));
      let finalChoices = [];
      for (let i = 0; i < decodedChoices.length; i++) {
        finalChoices.push({ value: i, label: decodedChoices[i] });
      }
      return finalChoices;
    })();

    return {
      category: question.category,
      question: he.decode(question.question),
      choices,
      correctAnswer: he.decode(question.correct_answer),
    };
  });

  // Returns decoded questions then start displaying
  displayQuestions(decodedQuestion, queries);
}

// Display question 1
async function displayQuestions(questions, queries) {
  shell.exec("clear");
  term("\n\n");
  displayQuestion(questions, questions[0], queries);
}

// Question and points counter
let currentQuestionIndex = 0;
let points = 0;

// Display each questions until it reach total amount of questions
async function displayQuestion(questions, question, queries) {
  // Check if all questions is answered
  if (currentQuestionIndex === questions.length)
    return handleFinalResult(queries);
  currentQuestionIndex++;

  // Question and answer logic
  term.yellow(`Category - ${question.category}\n`);
  term.cyan.bold(`${currentQuestionIndex}. ${question.question}\n`);
  const answer = await select({
    values: question.choices,
    valueRenderer: (value, selected) =>
      selected ? chalk.green.bold(value.label) : chalk.dim(value.label),
    selected: chalk.green.bold(" ->"),
    unselected: "  ",
  });

  if (answer.value.label == question.correctAnswer) {
    points++;
    term.green.bold(`Correct! - ${answer.value.label}`);
  } else {
    term(
      `${chalk.red.bold("Incorrect,")} The answer is - ${chalk.green.bold(
        question.correctAnswer
      )}`
    );
  }

  // Display next question
  term("\n\n\n");
  displayQuestion(questions, questions[currentQuestionIndex], queries);
}

// Final result page
async function handleFinalResult(queries) {
  const preloader = createSpinner("Calculating points");
  preloader.start();
  await sleep(1000);
  preloader.stop();
  shell.exec("clear");

  await new Promise((resolve) => {
    figlet(
      `
Quiz
Finished
		`,
      async (err, heading) => {
        term(gradient.pastel.multiline(heading));
        await sleep(1000);
        resolve();
      }
    );
  });

  term("\n\n");
  reviewPoints();
  term("\n\n");

  // Resets points and current question indicator
  currentQuestionIndex = 0;
  points = 0;

  // Options after displaying final result
  term.cyan.bold("  What do you want to do?\n");
  const action = await select({
    values: [
      { value: 0, label: "Try Again" },
      { value: 1, label: "Main menu" },
      { value: 2, label: "Exit" },
    ],
    valueRenderer: (value, selected) =>
      selected ? chalk.yellow.bold(value.label) : chalk.dim(value.label),
    selected: chalk.yellow.bold(" ->"),
    unselected: "  ",
  });

  // Trigger action
  switch (action.id) {
    case 0:
      shell.exec("clear");
      fetchQuestions(queries);
      break;
    case 1:
      shell.exec("clear");
      mainMenu(true);
      break;
    case 2:
      shell.exec("clear");
      term(`Selected - ${action.value.label}\n`);
      process.exit(0);
      break;
  }
}

// Conclusion base on points
function reviewPoints() {
  term(
    `Your points - ${chalk.blue(`${points} out of ${currentQuestionIndex}`)}\n`
  );

  const percentage = (percent) => Math.round(currentQuestionIndex * percent);
  // Message for 100%
  if (currentQuestionIndex === points)
    return term.bold(gradient.pastel.multiline("UNBELIEVABLE, Your so smart!"));
  // Message for 75%
  if (points >= percentage(0.75))
    return term(chalk.bold.hex("#ffd700")("Excellent, That's a good one!"));
  // Message for 50%
  if (points >= percentage(0.5))
    return term.green.bold("Good job, Better luck next time!");
  // Message for 25%
  if (points >= percentage(0.25))
    return term.blue.bold("Not bad, but you can try harder!");
  // Message for 1%
  if (points >= percentage(0.1))
    return term("Nice try, its better than nothing!");

  // Message for 0
  if (points === 0)
    return term(
      chalk.dim.strikethrough(
        "Wait what? it's unbelievable that you guessed all the wrong answer..."
      )
    );
}
