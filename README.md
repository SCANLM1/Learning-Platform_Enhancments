# Learning Platform Enhancements

This project improves the interactivity of LMS assessments for Foster Moore's Verne registry software by creating custom SCORM-compliant plugins using eXeLearning.

---

## Project Goals

- Enhance learning engagement through interactive assessments
- Replace passive content (e.g. static multiple-choice) with more dynamic and interactive tasks
- Ensure smooth LMS integration with working SCORM 1.2 completion tracking
- Document development and testing for easy use by the client

---

##  Plugin Types

Each plugin lives in its own folder under `plugins/`. These include:

###  Assessment Plugins

- **🧩 Drag and Drop** – Match items to categories or sequences
- **🐞 Find the Error** – Click the incorrect line of code
- **⌨️ Complete the Code** – Fill in the blanks in real syntax
- **⏱️ Timed Sequence** – Complete tasks before a timer runs out

###  Presentation Plugin

- **💻 Formatted Code Block** – Display clean, syntax-highlighted code examples

###  Navigation & Completion Plugins

- **⏮️ Prev-Fin Page iDevice** – Adds previous/finish buttons and triggers SCORM completion
- **⏮️⏭️ Prev-Next Page iDevice** – Adds navigation buttons between pages
- **➡️ Next Page iDevice** – Adds a "Next" button to link SCORM pages
- **✅ Finish Button iDevice** – Triggers SCORM completion with a single "Finish" button

---

## Folder Structure

```plaintext
plugins/
  ├── drag-and-drop-idevice/
  ├── find-the-error-idevice/
  ├── complete-the-code-idevice/
  ├── timed-sequence-idevice/
  ├── formatted-code-block-idevice/
  ├── prev-fin-page-idevice/
  ├── prev-next-page-idevice/
  ├── next-page-idevice/
  └── finish-button-idevice/

docs/
  └── Meeting Notes/

guides/
  └── SCOFunctions-Fixes.md

.github/
  └── ISSUE_TEMPLATE/
```

---

##  Testing Your Plugin

1. Apply the SCORM fix:
   See [guides/SCOFunctions-Fixes.md](guides/SCOFunctions-Fixes.md)

2. Open eXeLearning and develop your plugin

3. Export as **SCORM 1.2**

4. Upload and test in [TalentLMS](https://norealcompany.talentlms.com)

---

##  Contributing

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for how to:

- Follow folder structure
- Use branches properly
- Test SCORM compatibility
- Submit a plugin or fix

---

## License

MIT License — see the `LICENSE` file

---

##  Acknowledgements

- **Client**: Andy Connor, Foster Moore
- **Mentor**: Cheryll Singh, AUT
- **Moderator**: Jim Buchchan, AUT
- **Team**: Madison Tana, Joel Hillmann, Shubham Paudel, Mason Scanlan

Developed as part of AUT’s final-year R&D project.
