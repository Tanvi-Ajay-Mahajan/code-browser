// src/app/npm/npm.ts
import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Terminal } from '@xterm/xterm';

@Component({
  selector: 'app-npm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './npm.html',
  styleUrls: ['./npm.css']
})
export class Npm implements OnDestroy {
  @ViewChild('terminalContainer', { static: false }) containerRef!: ElementRef;

  private term!: Terminal;
  showConsole = false;

  // Track what the user is typing
  currentInput = '';
  // Custom prompt matching your workspace name
  private prompt = '\r\n\x1b[1;32muser@banao-app\x1b[0m:\x1b[1;34m~/project\x1b[0m$ ';

  openVSCodeTerminal() {
    this.showConsole = true;

    setTimeout(() => {
      if (!this.term) {
        this.term = new Terminal({
          cursorBlink: true, // Enable the flashing typing cursor
          theme: {
            background: '#09090b',
            foreground: '#cccccc',
            cursor: '#38bdf8' // Accent color cursor matching your theme
          },
          fontSize: 13,
          fontFamily: 'Consolas, monospace',
          rows: 10
        });

        this.term.open(this.containerRef.nativeElement);

        // 1. Print your initial server start simulation lines
        this.term.write('\x1b[1;32muser@banao-app\x1b[0m:\x1b[1;34m~/project\x1b[0m$ npm run start\r\n');
        this.term.write('> ng serve\r\n\n');
        this.term.write('\x1b[36m- Generating browser application bundles...\x1b[0m\r\n');
        this.term.write('\x1b[32m✔ Browser application bundle generation complete.\x1b[0m\r\n');
        this.term.write('\x1b[32m✔ Vite server running on http://localhost:4200/\x1b[0m\r\n');

        // 2. Print the input line prompt so the user knows they can type
        this.term.write(this.prompt);

        // 3. CRITICAL: Listen to real keyboard inputs
        this.term.onData((data: string) => {
          this.handleTerminalTyping(data);
        });
      }
    }, 50);
  }

  // Processes raw character inputs from the keyboard stream
  handleTerminalTyping(data: string) {
    const code = data.charCodeAt(0);

    if (code === 13) { // User pressed ENTER
      this.term.write('\r\n');
      this.executeTerminalCommand(this.currentInput.trim());
      this.currentInput = ''; // Reset input buffer for next command
    }
    else if (code === 127) { // User pressed BACKSPACE
      if (this.currentInput.length > 0) {
        this.currentInput = this.currentInput.slice(0, -1);
        this.term.write('\b \b'); // Moves cursor back, deletes character, moves cursor back again
      }
    }
    else { // User is typing normal alphanumeric characters
      this.currentInput += data;
      this.term.write(data); // Echoes character back to screen so user sees it
    }
  }

  // Evaluates the typed text once Enter is struck
  executeTerminalCommand(command: string) {
    if (command === '') {
      this.term.write(this.prompt);
      return;
    }

    if (command.startsWith('npm install')) {
      this.term.write('\x1b[33mResolving dependencies package trees...\x1b[0m\r\n');
      setTimeout(() => {
        this.term.write('\x1b[32m✔ Success:\x1b[0m Added package node assets to workspace tree.\r\n');
        this.term.write(this.prompt);
      }, 1200);
    }
    else if (command === 'clear') {
      this.term.clear();
      // Print just a clean line prompt without the boot logs
      this.term.write('\x1b[1;32muser@banao-app\x1b[0m:\x1b[1;34m~/project\x1b[0m$ ');
    }
    else {
      this.term.write(`bash: command not found: ${command}\r\n`);
      this.term.write(this.prompt);
    }
  }

  ngOnDestroy() {
    if (this.term) {
      this.term.dispose();
    }
  }
}
