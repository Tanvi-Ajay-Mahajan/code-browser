import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface NativeFileItem {
  name: string;
  type: 'file' | 'folder';
  handle: any; // FileSystemFileHandle or FileSystemDirectoryHandle
  isOpen?: boolean;
  children?: NativeFileItem[];
  cachedContent?: string;
}

@Component({
  selector: 'app-file-explorer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './file-explorer.html',
  styleUrls: ['./file-explorer.css']
})
export class FileExplorer {
  deviceProjectTree: NativeFileItem[] = [];
  selectedFile: NativeFileItem | null = null;
  currentFileText: string = '';
  rootDirectoryName: string = '';
  isApiSupported: boolean = 'showDirectoryPicker' in window;

  // SYSTEM CONTROL: Unified entry point button function to gain device file access
  async openDeviceDirectory() {
    if (!this.isApiSupported) {
      alert('Your browser does not natively support direct File System Access. Please try using modern Chrome, Edge, or Opera.');
      return;
    }

    try {
      // Prompt user to grant permission to open a local folder on their machine
      const directoryHandle = await (window as any).showDirectoryPicker({
        mode: 'readwrite'
      });

      this.rootDirectoryName = directoryHandle.name;
      this.deviceProjectTree = await this.parseDirectory(directoryHandle);
      this.selectedFile = null;
      this.currentFileText = '';
    } catch (err) {
      console.warn('User canceled or rejected directory streaming authorizations.', err);
    }
  }

  // Recursive directory mapper parsing nested tree files
  private async parseDirectory(dirHandle: any): Promise<NativeFileItem[]> {
    const items: NativeFileItem[] = [];

    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'directory') {
        items.push({
          name: entry.name,
          type: 'folder',
          handle: entry,
          isOpen: false,
          children: [] // Populated dynamically on toggle click later
        });
      } else if (entry.kind === 'file') {
        items.push({
          name: entry.name,
          type: 'file',
          handle: entry
        });
      }
    }
    // Alphabetical sort with folders on top
    return items.sort((a, b) => b.type.localeCompare(a.type) || a.name.localeCompare(b.name));
  }

  // Handle nested expansions when folder nodes are clicked
  async toggleFolder(folder: NativeFileItem) {
    folder.isOpen = !folder.isOpen;
    if (folder.isOpen && folder.children?.length === 0) {
      folder.children = await this.parseDirectory(folder.handle);
    }
  }

  // Stream raw data from physical disk storage directly into memory workspace editor
  async selectFile(file: NativeFileItem) {
    try {
      this.selectedFile = file;
      const fileData = await file.handle.getFile();
      this.currentFileText = await fileData.text();
    } catch (err) {
      this.currentFileText = `// Error reading target node data:\n// Access permissions may have expired or changed.`;
    }
  }

  // Core Writer Operation: Flushes memory text content buffer back onto target local disk path
  async saveActiveFileChanges() {
    if (!this.selectedFile) return;

    try {
      // Create a native file writer pipeline stream directly back onto the machine's disk file system
      const writableStream = await this.selectedFile.handle.createWritable();
      await writableStream.write(this.currentFileText);
      await writableStream.close();

      alert(`Successfully saved directly back to local machine disk path: ${this.selectedFile.name}`);
    } catch (err) {
      alert('Could not write updates back to disk. Make sure to accept the browser security write-prompts.');
      console.error(err);
    }
  }
}
