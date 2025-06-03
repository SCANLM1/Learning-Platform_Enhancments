# Learning Platform Enhancements Project

## Overview

This project enhances LMS assessments for Foster Moore’s **Verne registry** software by developing custom SCORM-compliant plugins using **eXeLearning**. It replaces passive learning tasks with dynamic, interactive assessment tools embedded directly within TalentLMS.

The initiative was part of AUT’s Research and Development Project (COMP703), led by a student team in collaboration with Foster Moore.

---

## Project Objectives

-  Improve engagement through interactive SCORM activities  
-  Customize eXeLearning for plugin authoring  
-  Export SCORM packages that trigger LMS completion  
-  Document testing, configuration, and installation clearly for future developers and clients  

---

## Plugin Types

Each iDevice is stored in its own folder and belongs to one of the following categories:

### Assessment Plugins (Assessment Category)

- 🧩 **Drag and Drop** – Match items to categories or positions  
- 🐞 **Find the Error** – Click the incorrect line of code  
- ⌨️ **Complete the Code** – Fill in blanks using `[[ ]]` syntax  
- 🛠️ **Code Formatting Activity** – Reformat messy code to match author-defined formatting  

### Presentation Plugin (Text and Tasks Category)

- 💻 **Code Display Block** – Show clean, syntax-highlighted code in a read-only format  

### Navigation & Completion Plugins (Navigation Category)

- ⏮️⏭️ **Prev-Next Page iDevice** – Adds Previous/Next navigation across pages  
- ✅ **Prev-Finish Page iDevice** – Adds Previous/Finish with SCORM completion trigger  
- ➡️ **Next Page iDevice** – Adds a forward-only page link  
- 🟩 **Finish Button iDevice** – Single-page SCORM trigger button  

---

## Tool Selection Summary

- **Selected Tool**: eXeLearning  
- **Why**: Open-source, easy to customize, local install, exports SCORM 1.2  
- **Key Fix**: Replacing `SCOFunctions.js` to support consistent SCORM completion  

---

## Folder Structure

```
/idevices
  ├── complete-code-idevice
  ├── drag-and-drop-idevice
  ├── find-the-error-idevice
  ├── code-formatting-activity-idevice
  ├── code-display-block-idevice
  ├── finish-button-idevice
  ├── next-page-idevice
  ├── prev-next-page-idevice
  └── prev-fin-page-idevice
/scripts
  └── SCOFunctions.js
/docs
  ├── Tool Evaluation Report.pdf
  ├── Manual Testing Procedure.pdf
  ├── Development Environment Flow Diagram.pdf
  └── Important Information and Setup Guide.pdf
/guides
  ├── LMS Upload SCORM packages - New iDevice User Manual.zip
  └── SCOFunctions-Fixes.md
```

---

## 🔧 Installation Guide

### 1. Install eXeLearning

- Download the **installable version** from [https://exelearning.net/en/](https://exelearning.net/en/)  
- Do **not** use portable or “ready-to-run” versions  

### 2. Copy Plugins from the Repository

Paste these folders into the idevices folder inside your eXeLearning installation directory.
The default path for Windows is usually:
```
C:\Program Files (x86)\exe\scripts\idevices
```
Note: this path may vary depending on your system or where eXeLearning was installed.
Make sure you're pasting into the correct scripts\idevices directory inside the actual installed location of eXeLearning.

- complete-code-idevice  
- drag-and-drop-idevice  
- find-the-error-idevice  
- code-formatting-activity-idevice  
- code-display-block-idevice  
- finish-button-idevice  
- next-page-idevice  
- prev-next-page-idevice  
- prev-fin-page-idevice  

### 3. Replace SCORM Functions

Overwrite `SCOFunctions.js` with the version from this repo See: [`scripts/SCOFunctions.js`](scripts/SCOFunctions.js):
The default path for this file in Windows is usually:
```
C:\Program Files (x86)\exe\scripts\SCOFunctions.js
```
Note: this path may vary depending on your system or where eXeLearning was installed.
Make sure you're pasting into the correct \scripts directory inside the actual installed location of eXeLearning.

Make sure this function is included:

```js
function finishCourse() {
  computeTime();
  if (typeof pipwerks !== "undefined" && pipwerks.SCORM) {
    pipwerks.SCORM.SetCompletionStatus("completed");
    pipwerks.SCORM.SetSuccessStatus("passed");
    pipwerks.SCORM.save();
    pipwerks.SCORM.quit();
  }
}
```
and this function is updated:

```js
function unloadPage(isSCORM) {
  if (typeof isSCORM === "undefined") {
      isSCORM = false;
  }

  if (exitPageStatus !== true) {
      if (scorm.GetCompletionStatus() !== "completed") {
          scorm.SetCompletionStatus("incomplete"); // Ensure incomplete if not finished
          scorm.SetSuccessStatus("failed");
      }
      doQuit();
  }
}
```

### 4. Clear Cache & Restart eXeLearning

- Press `Win + R` → type `%APPDATA%\exe`  
- Delete all contents  
- Restart eXeLearning to load plugins  

---

## ✍️ Authoring Guide: Using the Plugins

Each plugin includes an editing interface (Author View) and a learner-facing export (Learner View). When authoring content in eXeLearning, follow the instructions for each iDevice below to ensure correct functionality and SCORM completion tracking.

### Assessment Plugins

- **Complete the Code**  
  Use `[[blank]]` syntax to define parts of the code or sentence where learners must input the correct word or phrase.  
  Provide a comma-separated list of correct answers in the "Accepted Answers" field.  
  Completion is triggered only if **all blanks are filled in correctly**.  
  Optional hint and instructions fields are available.

- **Drag and Drop**  
  Define draggable items and matching drop targets in the authoring view.  
  Learners must drag each item into its corresponding target.  
  Submission is only allowed when **all drop zones are filled**.  
  Correct matches are highlighted in green; incorrect ones in red. Completion is triggered only on **full correctness**.

- **Find the Error**  
  Paste a block of code and select one line as the “error.”  
  In the learner view, lines become clickable. Learners must identify the faulty line.  
  Completion is triggered only when the **correct error line is selected**.  
  Retry logic and visual feedback are included.

- **Code Formatting Activity**  
  Provide an unformatted block of code and a properly formatted version.  
  Learners are asked to reformat the code themselves in a blank editor.  
  The plugin compares their input line-by-line to your correct version.  
  Completion is triggered when the **formatting matches exactly**.  
  Optional hints and reset buttons are available.

### Presentation Plugin

- **Code Display Block**  
  Paste syntax-highlighted code for display purposes only (read-only).  
  Learners can view code but not interact with it.  
  Clicking the **“Mark as Done”** button triggers SCORM completion.  
  Use this iDevice to show reference examples or demonstrate syntax.

### Navigation Plugins

These iDevices are used to structure multi-page SCORM packages and control navigation and completion:

- **Next Page**  
  Use on the **first page** of a SCORM module to guide learners forward.  
  Enter the next page’s filename (e.g., `page2.html`) in the field.

- **Prev-Next Page**  
  Use on **middle pages** to allow both backward and forward navigation.  
  Set both Previous and Next page URLs (e.g., `page1.html` and `page3.html`).

- **Prev-Finish Page**  
  Use on the **final page** of a multi-page SCORM module.  
  Clicking **Finish** triggers SCORM completion.  
  Set the Previous page URL to the second-to-last page.

- **Finish Button**  
  Use in **single-page SCORM modules** (e.g., tutorials or reference content).  
  Clicking this button alone will trigger SCORM completion.  
  No navigation is required—ideal for simple one-page content.

---


## 🚀 Exporting & Uploading to LMS

- Export as **SCORM 1.2**  
- Upload to **TalentLMS**  
- ⚠️ Ensure SCORM module is **embedded**, not opened in a popup  

---

## ✅ Manual Testing Procedure

Manual testing was conducted by the development team to verify the functionality, interactivity, and SCORM completion tracking of each custom iDevice.

While the procedure is primarily intended for internal use, the client may refer to `Manual Testing Procedure.docx` to understand how testing was carried out, what validation steps were followed, and how completion tracking was confirmed in TalentLMS.

This document outlines:

- How each plugin was tested in both authoring (editing) and learner (exported SCORM) modes  
- The process for verifying input validation, retry behavior, and feedback mechanisms  
- The steps taken to confirm successful SCORM completion status updates within the LMS

---

## 👥 Credits

**Client**: Andy Connor – Foster Moore  
**Mentor**: Cheryll Singh – AUT  
**Moderator**: Jim Buchchan – AUT  
**Team**: Madison Tana, Joel Hillmann, Shubham Paudel, Mason Scanlan
