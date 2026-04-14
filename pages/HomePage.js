import { BasePage } from './BasePage.js';
import { TodoSection } from './sections/TodoSection.js';
import { ListSection } from './sections/ListSection.js';


export class HomePage extends BasePage {
  constructor(page) {
    super(page, '/');

    this.todoSection = new TodoSection(page);
    this.listManager = new ListSection(page);
  }
  
}
