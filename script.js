// ==UserScript==
// @name         ChatGPT Direct-HTML
// @version      1.1
// @description  Allows you to execute HTML code within ChatGPT directly
// @author       YSSF
// @match        https://chat.openai.com/*
// @grant        GM_addStyle
// ==/UserScript==

(() => {
    'use strict';

    function trySelectElement(selector, callback, delay = 200) {
        const element = document.querySelector(selector);

        if (element) {
            callback(element);
        } else {
            setTimeout(() => trySelectElement(selector, callback), delay);
        }
    }

    const checkButton = document.createElement('button');
    checkButton.className = 'flex w-full items-center gap-2 rounded-lg p-2 text-sm hover:bg-token-sidebar-surface-secondary group-ui-open:bg-token-sidebar-surface-secondary check-for-html';
    checkButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="icon-md">
        <path d="M21 12C21 16.9706 16.9706 21 12 21C9.69494 21 7.59227 20.1334 6 18.7083L3 16M3 12C3 7.02944 7.02944 3 12 3C14.3051 3 16.4077 3.86656 18 5.29168L21 8M3 21V16M3 16H8M21 3V8M21 8H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    Check for HTML snippets
    `;
    trySelectElement('.pb-3\\.5 .pt-2', parent => {
        parent.appendChild(checkButton);
    });

    let isExpanded = false;

    checkButton.addEventListener('click', () => {
        isExpanded = !isExpanded;
        let expandedHeight;

        if (isExpanded) {
            const expanded = document.createElement('div');
            expanded.className = 'popover absolute bottom-full left-0 z-20 mb-1 w-full overflow-hidden rounded-lg border border-token-border-light bg-token-main-surface-primary p-1.5 outline-none opacity-100 translate-y-0 yssf-expanded';
            expanded.style.left = `${checkButton.offsetLeft}px`;
            expanded.style.bottom = `${checkButton.offsetHeight + 10}px`;
            expanded.style.width = `${checkButton.offsetWidth}px`;
            expanded.style.opacity = 0;
            expanded.style.height = 'max-content';
            document.body.appendChild(expanded);

            setTimeout(() => {
                expanded.style.bottom = `${checkButton.offsetHeight + 15}px`;
                expanded.style.opacity = 1;
                expanded.scrollTop = expanded.scrollHeight;
            });

            const htmlSnippets = document.querySelectorAll('.language-html');

            if (htmlSnippets.length == 0) {
                expanded.textContent = 'No HTML snippets found!';
                expanded.style.color = '#ccc';
            } else {
                htmlSnippets.forEach((snippet, index) => {
                    const domParser = new DOMParser();
                    const parsed = domParser.parseFromString(snippet.innerText, 'text/html');
                    let parsedTitle;
                    try {
                        parsedTitle = parsed.querySelector('title').textContent;
                    } catch {
                        parsedTitle = 'Unnamed';
                    }

                    const expandedButton = document.createElement('a');
                    expandedButton.setAttribute('as', 'button');
                    expandedButton.className = 'flex gap-2 rounded p-2.5 text-sm cursor-pointer focus:ring-0 radix-disabled:pointer-events-none radix-disabled:opacity-50 group items-center hover:bg-token-sidebar-surface-secondary';
                    expandedButton.innerHTML = parsedTitle;
                    expandedButton.title = index + 1;
                    expanded.appendChild(expandedButton);

                    expandedButton.addEventListener('click', () => {
                        const iframeContent = document.createElement('div');
                        iframeContent.classList.add('yssf-iframe-content');
                        iframeContent.innerHTML = `
                        <div class="header">
                            <div class="title">${parsedTitle}</div>
                            <div class="close">&times;</div>
                        </div>
                        `;
                        document.body.appendChild(iframeContent);

                        setTimeout(() => {
                            iframeContent.style.opacity = 1;
                            iframeContent.style.transform = 'translate(-50%, -50%) scale(1)';
                        });

                        const iframeHeader = iframeContent.querySelector('.header');
                        const iframeClose = iframeHeader.querySelector('.close');

                        let isDragging = false;
                        let initialX, initialY;

                        iframeHeader.addEventListener('mousedown', e => {
                            isDragging = true;
                            initialX = e.clientX - iframeContent.offsetLeft;
                            initialY = e.clientY - iframeContent.offsetTop;
                        });

                        document.addEventListener('mousemove', e => {
                            if (isDragging) {
                                let newX = e.clientX - initialX;
                                let newY = e.clientY - initialY;
                                iframeContent.style.left = `${newX}px`;
                                iframeContent.style.top = `${newY}px`;
                            }
                        });

                        document.addEventListener('mouseup', () => {
                            isDragging = false;
                        });

                        iframeClose.addEventListener('click', () => {
                            iframeContent.style.opacity = 0;
                            iframeContent.style.transform = 'translate(-50%, -50%) scale(.8)';
                            setTimeout(() => iframeContent.remove(), 200);
                        });

                        const iframe = document.createElement('iframe');
                        iframeContent.appendChild(iframe);

                        let iframeDoc = iframe.contentDocument;
                        iframeDoc.open();
                        iframeDoc.write(parsed.documentElement.innerHTML);
                        iframeDoc.close();

                        expanded.style.bottom = `${checkButton.offsetHeight + 10}px`;
                        expanded.style.opacity = 0;
                        setTimeout(() => expanded.remove(), 200);
                        isExpanded = false;
                    });
                });
            }
        } else {
            document.querySelectorAll('.yssf-expanded').forEach(exp => {
                exp.style.bottom = `${checkButton.offsetHeight + 10}px`;
                exp.style.opacity = 0;
                setTimeout(() => exp.remove(), 200);
            });
        }
    });

    GM_addStyle(`
    .check-for-html {
        height: 48px;
    }

    .yssf-iframe-content {
        position: fixed;
        left: 50%;
        top: 50%;
        border-radius: 8px;
        border: 1px solid var(--border-heavy);
        overflow: hidden;
        transform: translate(-50%, -50%) scale(.8);
        resize: both;
        min-width: 230px;
        min-height: 90px;
        width: 6in;
        height: 3in;
        opacity: 0;
        transition: 200ms;
        transition-property: opacity, transform;
    }

    .yssf-iframe-content iframe {
        width: 100%;
        height: 100%;
    }

    .yssf-iframe-content .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #171717;
        padding: 7px;
    }

    .yssf-iframe-content .header .title {
        pointer-events: none;
        user-select: none;
    }

    .yssf-iframe-content .header .close {
        border-radius: 50%;
        width: 16px;
        height: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: background 200ms;
    }

    .yssf-iframe-content .header .close:hover {
        background-color: #cc3f35;
    }

    .yssf-expanded {
        max-height: 2.5in;
        overflow: auto;
        transition: 200ms;
        transition-property: bottom, opacity;
    }
    `);
})();