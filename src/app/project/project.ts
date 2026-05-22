// src/app/npm/npm.ts
import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Vital for real-time editor text binding
import { Terminal } from '@xterm/xterm';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project.html',
  styleUrls: ['./project.css']
})
export class project implements OnDestroy {
  @ViewChild('terminalContainer', { static: false }) containerRef!: ElementRef;
  @ViewChild('previewFrame', { static: false }) iframeRef!: ElementRef;

  private term!: Terminal;
  showConsole = false;
  currentInput = '';
  private prompt = '\r\n\x1b[1;32muser@banao-app\x1b[0m:\x1b[1;34m~/project\x1b[0m$ ';

  // Pre-loaded baseline sandbox template code inside the editor viewport
  editableCode = `<div style="text-align: center; font-family: sans-serif; padding-top: 40px;">
  <h1 style="color: #38bdf8;">🎉 Welcome to BanaoApp Live IDE!</h1>
  <p style="color: #555; font-size: 16px;">Modify this code block on the left to see hot reload changes update here in real-time.</p>
  <button style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer;" onclick="alert('Live interaction working!')">Test Application Button</button>
</div>`;

  openVSCodeTerminal() {
    this.showConsole = true;

    setTimeout(() => {
      if (!this.term) {
        this.term = new Terminal({
          cursorBlink: true,
          theme: { background: '#09090b', foreground: '#cccccc', cursor: '#38bdf8' },
          fontSize: 12,
          fontFamily: 'Consolas, monospace',
          rows: 8
        });

        this.term.open(this.containerRef.nativeElement);

        // Output compilation feedback tracking log states to user
        this.term.write('\x1b[1;32muser@banao-app\x1b[0m:\x1b[1;34m~/project\x1b[0m$ npm run start\r\n');
        this.term.write('> ng serve --live-reload\r\n\n');
        this.term.write('\x1b[36m- Local server spin up processing...\x1b[0m\r\n');
        this.term.write('\x1b[32m✔ Live compilation server established. Bound channel mapping at port 4200.\x1b[0m\r\n');
        this.term.write(this.prompt);

        this.term.onData(data => this.handleTerminalTyping(data));
      }

      // Inject code layout canvas setup immediately
      this.updateLivePreview();
    }, 50);
  }

  // Live compilation injector: copies string values directly into iframe engine
  updateLivePreview() {
    if (this.iframeRef && this.iframeRef.nativeElement) {
      const iframe: HTMLIFrameElement = this.iframeRef.nativeElement;
      iframe.srcdoc = this.editableCode;
    }
  }

  // Listens to user edits to trigger immediate hot-reload logs inside terminal canvas
  onCodeChange() {
    this.updateLivePreview();
    if (this.term) {
      this.term.write('\r\n\x1b[33m[HMR] File change detected. Recompiling application modules...\x1b[0m\r\n');
      this.term.write('\x1b[32m✔ HMR Update applied successfully.\x1b[0m' + this.prompt);
    }
  }

  handleTerminalTyping(data: string) {
    const code = data.charCodeAt(0);
    if (code === 13) { // Enter key
      this.term.write('\r\n');
      this.executeCommand(this.currentInput.trim());
      this.currentInput = '';
    } else if (code === 127) { // Backspace key
      if (this.currentInput.length > 0) {
        this.currentInput = this.currentInput.slice(0, -1);
        this.term.write('\b \b');
      }
    } else {
      this.currentInput += data;
      this.term.write(data);
    }
  }

  executeCommand(command: string) {
    if (command === 'clear') {
      this.term.clear();
      this.term.write('\x1b[1;32muser@banao-app\x1b[0m:\x1b[1;34m~/project\x1b[0m$ ');
    } else if (command === 'npm run start' || command === 'npm run') {
      this.term.write('\x1b[35mServer already running at http://localhost:4200/\x1b[0m\r\n');
      this.term.write(this.prompt);
    } else if (command !== '') {
      this.term.write(`bash: command execution not mapped for: ${command}\r\n`);
      this.term.write(this.prompt);
    } else {
      this.term.write(this.prompt);
    }
  }

  ngOnDestroy() {
    if (this.term) this.term.dispose();
  }
}
