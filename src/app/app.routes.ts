import { Routes } from '@angular/router';
import { Compiler } from './compiler/compiler';
import { FileExplorer } from './file-explorer/file-explorer';
import { Npm } from './npm/npm';
import { project } from './project/project';
import { Interview } from './interview/interview';


export const routes: Routes = [
  {
    path: 'compiler',
    component: Compiler
  },
  { path: 'file-explorer',
    component:FileExplorer
  },
  {
    path : 'npm',
    component:Npm
  },
  {
    path : 'project',
    component:project
  },
  {
    path : 'Interview',
    component:Interview
  }
];
