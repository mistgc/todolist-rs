<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { TodoItem } from './assets/script/TodoItem'
import { writeFile_Text, readFile_Text } from './assets/script/tauri-fs'

const title = ref('Todolist')
const dialogFlag = ref('true')
const todoItemContent = ref('')
const todoItemLevelString = ref('Red')
const todolist = ref(new Array<TodoItem>())

function getLevel(levelstr: string): number {
  if (levelstr === 'Red')
    return 3
  else if (levelstr === 'Blue')
    return 2
  else
    return 1
}

function createTodoItem() {
  let todoItemLevel = getLevel(todoItemLevelString.value)
  let newTodoItem = new TodoItem(todoItemContent.value, todoItemLevel);
  todolist.value.push(newTodoItem);
  todolist.value.sort((x, y) => y.level - x.level);

  let data = JSON.stringify(todolist.value);
  console.log(data)

  // Save data into a JSON file
  writeFile_Text('todolist.json', data).then(() => {
          console.log("Complete!");
  });

  stepback();
}

function removeTodoItem(id: string) {
  try {
    let id_num = Number(id)
    todolist.value = todolist.value.filter((item) =>  item.id !== id_num)
    todolist.value.sort((x, y) => y.level - x.level)
  } catch (err) {
    console.log('Invalid "TodoItem.id"')
  } finally {
    let data = JSON.stringify(todolist.value)
    console.log(data)

    // Save data into a JSON file
    writeFile_Text('todolist.json', data).then(() => {
      console.log("Complete!");
    });

  }
}

function stepback() {
  let e = document.querySelector('.dialog-wrapper') as HTMLDivElement
  let body = document.querySelector('.todolist-list-wrapper') as HTMLDivElement
  let bar = document.querySelector('.header-wrapper') as HTMLDivElement
  let crtDig = document.querySelector('.create-dialog') as HTMLDivElement

  e.style.display = 'none'
  crtDig.style.display = 'none'
  body.style.filter = 'none'
  bar.style.filter = 'none'
}

function createDialog() {
  let e = document.querySelector('.dialog-wrapper') as HTMLDivElement
  let body = document.querySelector('.todolist-list-wrapper') as HTMLDivElement
  let bar = document.querySelector('.header-wrapper') as HTMLDivElement
  let crtDig = document.querySelector('.create-dialog') as HTMLDivElement

  e.style.display = 'block'
  crtDig.style.display = 'block'
  body.style.filter = 'blur(4px)'
  bar.style.filter = 'blur(4px)'
}

onMounted(() => {
  let okBtn = document.querySelector('#ok') as HTMLButtonElement;
  let okImg = document.querySelector('#ok img') as HTMLImageElement;

  // Load local data of 'todolist.json' as 'Array<todoitem>'.
  let localData: string = '';
  readFile_Text('todolist.json').then((contents) => {
    localData = contents;
    console.log(localData);
    if (localData !== '') {
      let objArray = JSON.parse(localData);
      for (let item of objArray) {
        console.log(item);
        let newTodoItem = new TodoItem(item._content.toString(), item._level as number);
        todolist.value.push(newTodoItem);
      }
      console.log(todolist.value);
    }
  });



  watch(todoItemContent, () => {
    if (todoItemContent.value !== '') {
      okBtn.style.pointerEvents = 'auto';
      okImg.classList.add('dialog-ok-img-normal');
    } else {
      okBtn.style.pointerEvents = 'none';
      okImg.classList.remove('dialog-ok-img-normal');
    }
  });
});
</script>

<template>
<header>
  <div class="header-wrapper">
      <div class="todolist-menu-wrapper">
      <button class="todolist-menu-button"><img src="./assets/images/menu.svg" alt=""></button>
    </div>
    <div class="todolist-title-wrapper">
      <div class="todolist-title-text">
        <span>{{ title }}</span>
      </div>
    </div>
    <div class="todolist-help-wrapper">
      <button class="todolist-help-button"><img src="./assets/images/help.svg" alt=""></button>
    </div>
  </div>
</header>

  <div class="todolist-list-wrapper">
    <div class="todolist-list-box">
      <div class="choice-bar">
        <button class="search-todo"><img src="./assets/images/search.svg" alt=""></button>
        <button class="create-todo" id="create" @click="createDialog"><img src="./assets/images/create.svg" alt=""></button>
      </div>
      
      <div class="todoitems">
        <div class="todoitem" v-for="item in todolist" :key="item.id">
          <span class="todoitem-level" v-if="item.level === 3" style="color: red;">Red</span>
          <span class="todoitem-level" v-else-if="item.level === 2" style="color: blue;">Blue</span>
          <span class="todoitem-level" v-else-if="item.level === 1" style="color: green;">Green</span>
          <span class="todoitem-content">{{item.content}}</span>
          <button class="todoitem-finish" @click="removeTodoItem(item.id.toString())">Done.</button>
        </div>
      </div>
    </div>
  </div>

  <div class="dialog-wrapper">
    <div class="create-dialog">
      <div class="create-dialog-bar">
        <button class="dialog-stepback" id="stepback" @click="stepback"><img src="./assets/images/stepback.svg" alt=""></button>
        <button class="dialog-ok" id="ok" @click="createTodoItem"><img src="./assets/images/Ok_banned.svg" alt=""></button>
      </div>
      <div class="create-dialog-content">
        <select v-model="todoItemLevelString">
          <option>Red</option>
          <option>Blue</option>
          <option>Green</option>
        </select>
        <input v-model="todoItemContent" placeholder="Content">
      </div>
    </div>
  </div>

</template>

<style>
* {
  margin: 0;
  padding: 0;
  border: none;
}

header {
  width: 100%;
  min-width: 800px;
  position: absolute;
  background: #eee;
}

.header-wrapper {
  width: 96%;
  min-width: 800px;
  margin: 0 auto;
  display: flex;
  transition: 0.2s;
}

.header-wrapper div{
  float: left;
}

.todolist-menu-button, .todolist-help-button {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  transition: 0.2s;
  margin: 3px 10px;
  background: #eee;
}

.todolist-menu-button:hover, .todolist-help-button:hover {
  background: #ccc;
}


.todolist-menu-button img, .todolist-help-button img{
  height: 30px;
  width: 30px;
}

.todolist-title-wrapper {
  position:relative;
  width: 95%;
  display: flex;
}

.todolist-title-text {
  margin: auto auto;
}

.todolist-title-wrapper span {
  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
}

.todolist-list-wrapper {
  width: 100%;
  height: 500px;
  position: absolute;
  display: flex;
  top: 70px;
  transition: 0.2s;
}

.todolist-list-box {
  background: #eee;
  position: relative;
  margin: 0 auto;
  width: 1000px;
  min-height: 500px;
  height: fit-content;
  padding-bottom: 50px;
  min-width: 800px;
  border-radius: 10px;
}

.choice-bar {
  width: 800px;
  height: 30px;
  min-width: 800px;
  margin: 0 auto;
  border-radius: 10px;
  display: flex;
}

.search-todo img, .create-todo img {
  width: 30px;
  height: 30px;
  border-radius: 10px;
}

.search-todo {
  width: 30px;
  height: 30px;
  margin: 10px;
  position: absolute;
  left: 0px;
  border-radius: 10px;
  transition: 0.2s;
  background: #eee;
}

.create-todo {
  width: 30px;
  height: 30px;
  position: absolute;
  right: 0px;
  margin: 10px;
  border-radius: 10px;
  transition: 0.2s;
  background: #eee;
}

.search-todo:hover, .create-todo:hover {
  background: #ccc;
}

.dialog-wrapper {
  width: 100%;
  height: 1920px;
  position: fixed;
  z-index: 2000;
  display: none;
  transition: 0.2s;
}

.create-dialog {
  position: relative;
  width: 400px;
  height: 180px;
  top: 230px;
  margin: 0 auto;
  z-index: 2000;
  border: 2px #555 solid;
  padding: 10px;
  border-radius: 10px;
  display: none;
  box-shadow: 2px 2px 10px #00000050;
  animation-name: create-dialog-wake;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  background: #ffffffce;
}

@keyframes create-dialog-wake {
  0% {opacity: 0;}
  100% {opacity: 1; top: 200px;}
}

.dialog-stepback img, .dialog-ok img {
  width: 30px;
  height: 30px;
  transition: 0.2s;
  border-radius: 10px;
}

.create-dialog-bar {
  height: 30px;
  width: 100%;
}

.dialog-stepback, .dialog-ok {
  background: #eee;
  transition: 0.2s;
  border-radius: 10px;
  height: 30px;
  width: 30px;
}

.dialog-stepback {
  float: left;
}

.dialog-ok {
  float: right;
}

.dialog-stepback:hover, .dialog-ok:hover {
  background: #ccc;
}

.dialog-ok {
  pointer-events: none;
}

.dialog-ok-img-normal {
  content: url('./assets/images/Ok.svg');
}

.dialog-ok:hover .dialog-ok-img-normal {
  content: url('./assets/images/Ok_selected.svg');
  width: 30px;
  height: 30px;
}

.dialog-stepback:hover img {
  content: url('./assets/images/stepback_selected.svg');
  transition: 0.2s;
  width: 30px;
  height: 30px;
}

.create-dialog-content {
  width: 200px;
  margin: 0 auto;
  margin-top:20px;
}

.create-dialog-content select {
  width: 75px;
  height: 30px;
  border: 2px #000 solid;
  border-radius: 5px;
}

.create-dialog-content input {
  margin-top: 30px;
  width: 200px;
  height: 30px;
  border: 2px #000 solid;
  border-radius: 5px;
  font-size: 16px;
}

.todoitems {
  top: 10px;
  width: 800px;
  min-width: 400px;
  height: auto;
  margin: 0 auto;
  position: relative;
}

.todoitem {
  margin-bottom: 15px;
  margin-top: 15px;
  position: relative;
  width: 800px;
  height: 65px;
  border-bottom: 2px #000 solid;
}

.todoitem-level {
  display: block;
  position: absolute;
  top: 0;
  left: 10px;
  font-size: 20px;
}

.todoitem-content {
  display: block;
  width: 300px;
  font-size: 25px;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: normal !important;
  position: absolute;
  left: 10px;
  bottom: 0px;
}

.todoitem-finish {
  display: inline-block;
  position: absolute;
  right: 10px;
  bottom: 5px;
  font-size: 20px;
  width: 70px;
  height: 30px;
  border-radius: 10px;
  background: #eee;
  box-shadow: 2px 2px 5px 1px #00000070, -2px -2px 2px 1px #fff;
}
</style>
