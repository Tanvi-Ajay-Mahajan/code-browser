import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface RuntimeConfig {
  name: string;
  filename: string;
  defaultTemplate: string;
  expectedOutput: string;
}

@Component({
  selector: 'app-compiler',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compiler.html',
  styleUrls: ['./compiler.css']
})
export class Compiler {
onLanguageChange() {
throw new Error('Method not implemented.');
}
runCode() {
throw new Error('Method not implemented.');
}
  isCompiling = false;
  activeFile = 'main';

  runtimes: { [key: string]: RuntimeConfig } = {
    javascript: {
      name: 'JavaScript (Node.js)',
      filename: 'index.js',
      defaultTemplate: `// Node.js Runtime Sandbox\nconst items = ['Express', 'Angular', 'V8'];\nconsole.log("Loading modules...");\n\nitems.forEach(item => {\n    console.log(\` -> Initialized: \${item}\`);\n});\n\nconsole.log("\\nServer listening on port 8080.");`,
      expectedOutput: 'Loading modules...\n -> Initialized: Express\n -> Initialized: Angular\n -> Initialized: V8\n\nServer listening on port 8080.'
    },
    python: {
      name: 'Python 3',
      filename: 'app.py',
      defaultTemplate: `# Python Cloud Sandbox\nimport sys\n\ndef run_audit():\n    print(f"Python Interpreter Environment: {sys.version.split()[0]}")\n    matrix = [x*2 for x in range(4)]\n    print(f"Computed matrix payload: {matrix}")\n\nprint("System starting...")\nrun_audit()`,
      expectedOutput: 'System starting...\nPython Interpreter Environment: 3.11.4\nComputed matrix payload: [0, 2, 4, 6]'
    }
  };

  selectedLanguage = 'javascript';
  sourceCode = this.runtimes[this.selectedLanguage].defaultTemplate;
  terminalOutput = 'CodeBrowser compiler ready. Select runtime configuration and click Run.';
selectedLanguageKey: any;
  isExecuting: string | boolean = false;
editorCode: any;
consoleOutput: any;

  constructor(private router: Router) {}

  onLanguageSelectionChange(): void {
    this.sourceCode = this.runtimes[this.selectedLanguage].defaultTemplate;
    this.terminalOutput = `Switched workspace profile runtime context to target ${this.runtimes[this.selectedLanguage].name}.`;
  }

  executeSandboxCode(): void {
    this.isCompiling = true;
    this.terminalOutput = `[STDOUT - INFO] Spawning sandbox container layer...\n[STDOUT - COMPILING] Verifying dependencies inside filesystem context...\n`;

    setTimeout(() => {
      this.terminalOutput += `[STDOUT - EXEC] Executing virtualized code tree inside ${this.runtimes[this.selectedLanguage].filename}...\n\n`;
      this.terminalOutput += this.runtimes[this.selectedLanguage].expectedOutput;
      this.isCompiling = false;
    }, 1200);
  }

  exitWorkspace(): void {
    this.router.navigate(['/']);
  }
}
