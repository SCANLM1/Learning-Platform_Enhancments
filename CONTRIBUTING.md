# Contributing to Learning Platform Enhancements

Thanks for helping improve this project! Whether you're fixing a bug, developing a new iDevice, improving SCORM integration, or enhancing documentation, please follow the guidelines below.

---

## 📁 Folder Structure

- `/idevices/` — Each iDevice has its own folder:
  - `complete-code-idevice/`
  - `drag-and-drop-idevice/`
  - `find-the-error-idevice/`
  - `code-formatting-activity-idevice/`
  - `code-display-block-idevice/`
  - `finish-button-idevice/`
  - `next-page-idevice/`
  - `prev-next-page-idevice/`
  - `prev-fin-page-idevice/`
- `/scripts/` — Global scripts like `SCOFunctions.js`
- `/docs/` — Project documentation and supporting files
- `/guides/` — Technical implementation notes (e.g., SCORM fix instructions)

---

## 🔧 Development Workflow

1. **Create a new branch** from `main`:
   ```bash
   git checkout -b feature/<plugin-or-fix>
   ```

2. **Develop inside the correct iDevice folder**. Follow naming conventions and separate edition/export logic appropriately.

3. **Replace SCORM Functions**
   Ensure your local copy of `SCOFunctions.js` has been replaced with the updated version from this repository. See: [`scripts/SCOFunctions.js`](scripts/SCOFunctions.js)
   
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
   After replacing the file, always clear your %APPDATA%\exe cache and restart eXeLearning to ensure the new version is loaded correctly.

4. **Test the plugin in eXeLearning**:
   - Export the plugin as a **SCORM 1.2** package
   - Upload to **TalentLMS**
   - Confirm completion tracking and interaction behavior in the LMS report view

5. **Commit changes with a meaningful message**:
   ```bash
   git add .
   git commit -m "Add feature: <plugin-name> idevice"
   ```

6. **Push your branch and open a Pull Request**:
   ```bash
   git push origin feature/<plugin-or-fix>
   ```

---

## ✅ Plugin Submission Checklist

Before opening a pull request, confirm that:

- [ ] Your folder is named correctly (`kebab-case-idevice` format)
- [ ] The plugin includes:
  - [ ] `config.xml`
  - [ ] `edition/` folder with authoring interface
  - [ ] `export/` folder with learner view and SCORM logic
- [ ] Plugin appears correctly in eXeLearning
- [ ] Plugin exports and runs correctly in TalentLMS
- [ ] Completion is tracked correctly on **embedded** SCORM usage (not popup)

---

## 🧑‍💻 Style Guidelines

- Use clear, descriptive commit messages
- Comment complex JavaScript logic where needed
- Use `kebab-case` for all filenames and folders (e.g., `code-display-block-idevice`)
- Keep unrelated changes in separate branches and PRs
- Maintain consistent folder structure across all plugins

---

## 🙏 Thanks

Your contributions help improve the learning experience for LMS users and support future development continuity.

If in doubt, check the main `README.md` or reach out to a maintainer.
