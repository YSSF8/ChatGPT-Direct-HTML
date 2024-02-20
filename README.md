# ChatGPT Direct-HTML

## Overview

ChatGPT Direct-HTML is a sophisticated UserScript designed for the Tampermonkey extension. It enhances the user experience on the ChatGPT platform by enabling the direct execution of HTML code within the chat interface. It's made to save users time when trying to test a ChatGPT-generated HTML code by directly executing it within the ChatGPT website, you can always use your browser's DevTools to get the errors and address them to ChatGPT to fix its mistakes.

## Installation Procedure

1. Install the Tampermonkey extension compatible with your browser.
2. Navigate to the Tampermonkey dashboard and select the option to "Create a new script".
3. Replace the default script with the ChatGPT Direct-HTML script and save the changes.

## Functionality

The UserScript adds a button labeled "Check for HTML snippets" to the ChatGPT interface. This button, when clicked, scans the chat for HTML snippets and presents them in a dropdown menu. Users can then select any snippet from this menu to view it in a separate, sandboxed iframe.

### Feature Breakdown

- **HTML Snippet Detection**: Scans the chat for HTML snippets.
- **HTML Snippet Preview**: Allows users to preview HTML snippets in a separate, sandboxed iframe.
- **Freely executing codes for comparison**: You can freely execute lots of codes, get lots of popups to compare them to each other.
- **Highlighting**: Hover over a snippet in the snippet finder, its original reference will be highlighted.

## Authorship

This UserScript was developed by YSSF.

## Licensing

This project is distributed under the terms of the MIT License.
