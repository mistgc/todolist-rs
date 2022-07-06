export {
    TodoItem
}

import { ref } from 'vue'

class TodoItem {
  public static counter: number = 0
  private _id: string
  private _content: string
  private _level: number

  constructor(c: string, l: number) {
    this._id = String(TodoItem.counter++)
    this._content = c
    this._level = l
  }

  get id(): number {
      return Number(this._id)
  }

  get content(): string {
    return this._content
  }
  
  set content(c: string) {
    this._content = c
  }

  get level(): number {
    return this._level
  }

  set level(l: number) {
    this.level = l
  }
}