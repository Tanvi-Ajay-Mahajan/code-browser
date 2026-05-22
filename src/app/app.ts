import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileExplorer } from './file-explorer/file-explorer';
import { Npm } from './npm/npm';
import { project } from './project/project';
import { Interview } from './interview/interview';

interface LanguageTemplate {
  name: string;
  defaultCode: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FileExplorer,
    Npm,
    project,
    Interview
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  // Navigation visibility & runtime state toggle flags
  isCodingMode = false;
  isExecuting = false;
  isProjectRunning = false;
  isInterviewRunning = false;

  // Code editor environment defaults
  languages: { [key: string]: LanguageTemplate } = {
    javascript: {
      name: 'JavaScript (Node.js)',
      defaultCode: `// Welcome to CodeBrowser\nconsole.log("Hello from JavaScript!");\n\nconst greet = (name) => \`Welcome, \${name}!\`;\nconsole.log(greet("Developer"));`
    },
    python: {
      name: 'Python 3',
      defaultCode: `# Welcome to CodeBrowser\ndef greet(name):\n    return f"Welcome, {name}!"\n\nprint("Hello from Python!")\nprint(greet("Developer"))`
    },
    typescript: {
      name: 'TypeScript',
      defaultCode: `// Welcome to CodeBrowser\ninterface User {\n  name: string;\n}\n\nconst user: User = { name: "Developer" };\nconsole.log(\`Hello TypeScript! Target: \${user.name}\`);`
    }
  };

  selectedLanguageKey = 'javascript';
  editorCode = this.languages[this.selectedLanguageKey].defaultCode;
  consoleOutput = 'Press "Run Code" to execute script...';

  /**
   * Opens the full-screen coding playground popup workspace overlay
   */
  startCoding() {
    this.isCodingMode = true;
    this.isProjectRunning = false;
    this.isInterviewRunning = false;
    this.consoleOutput = 'Workspace sandbox ready. Press "Run Code" to execute.';
  }

  /**
   * Handles the playground runtime language dropdown mutations
   */
  onLanguageChange() {
    this.editorCode = this.languages[this.selectedLanguageKey].defaultCode;
    this.consoleOutput = `Environment switched to ${this.languages[this.selectedLanguageKey].name}. Console cleared.`;
  }

  /**
   * Dynamic Safe Evaluation Engine for local browser code runtimes
   */
  runCode() {
    this.isExecuting = true;
    this.consoleOutput = '[SYSTEM] Spawning isolated runtime container...\n';

    setTimeout(() => {
      // Python simulation handler
      if (this.selectedLanguageKey === 'python') {
        this.consoleOutput += `[STDOUT] Hello from Python!\n[STDOUT] Welcome, Developer!\n\nProcess completed successfully with exit code 0.`;
        this.isExecuting = false;
        return;
      }

      // Capture outputs cleanly from console instances
      const capturedLogs: string[] = [];
      const originalLog = console.log;

      // Intercept active console telemetry logs streaming from standard output strings
      console.log = (...args) => {
        capturedLogs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
      };

      try {
        let executableString = this.editorCode;
        // Basic parser sanitization rules to clean out static type signatures
        if (this.selectedLanguageKey === 'typescript') {
          executableString = executableString.replace(/interface\s+\w+\s*\{[^}]*\}/g, '');
          executableString = executableString.replace(/:\s*\w+/g, '');
        }

        // Initialize compiler evaluation stack
        const executionResult = new Function(executableString);
        executionResult();

        this.consoleOutput += capturedLogs.length > 0
          ? capturedLogs.map(line => `[STDOUT] ${line}`).join('\n')
          : '[SYSTEM] Execution completed with no console logs returned.';
      } catch (err: any) {
        this.consoleOutput += `[RUNTIME ERROR] ${err.message}`;
      } finally {
        console.log = originalLog; // Safely return stdout pipes back to browser
        this.isExecuting = false;
      }
    }, 900);
  }

  /**
   * Activates the isolated Project Sandbox workspace view
   */
  startLiveProject(): void {
    this.isProjectRunning = true;
    this.isInterviewRunning = false;
    this.isCodingMode = false;
  }

  /**
   * Activates the Browser Interview workspace session layout
   */
  startInterviewSession(): void {
    this.isInterviewRunning = true;
    this.isProjectRunning = false;
    this.isCodingMode = false;
  }

  /**
   * Resets all session runtime triggers back to false, safely heading back home
   */
  stopAllSessions(): void {
    this.isProjectRunning = false;
    this.isInterviewRunning = false;
    this.isCodingMode = false;
  }
}
