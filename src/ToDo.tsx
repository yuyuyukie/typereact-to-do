/* eslint-disable no-useless-constructor */
import { type } from "os";
import React from "react";
import "./ToDo.css";

// なにもないときのテキスト OK
// isDoneを消すやつOK
// Deleteのファビコンを押したときに認識されてない。Edit機能なくせばすぐできそう。
//Deleteができてない。 OK
// keyをindexにしているが、これだと整理やソートできない
// Date.now()をつかっている  OK
// deleteボタン OK
// Controller周り
// Container完了関係 OKスタイリングまだ（doneContainerを
// 消したためfilterでソートしたりスタイリング必要 OK

enum ShowStatus {
  ShowAll = 0,
  ShowActive = 1,
  ShowDone = 2,
}
type ToDoList = {
  value: string;
  isDone: boolean;
  key: string;
};
type ToDoState = {
  input: string;
  todoList: ToDoList[];
  showDescription: boolean;
  showStatus: ShowStatus;
};
type ToDoProps = {
  showDescription?: boolean;
  handleDescriptionClick?: () => void;
  inputValue?: string;
  handleShowStatusClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  todoList?: ToDoList[];
  style?: React.CSSProperties;
  onInputChange?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  addToDo?: Function;
  clearForm?: Function;
  eliminateDone?: Function;
  handleToDoClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};
class ToDo extends React.Component<ToDoProps, ToDoState> {
  state: ToDoState;
  constructor(props: ToDoProps) {
    super(props);
    this.state = {
      input: "",
      todoList: [],
      showDescription: false,
      showStatus: ShowStatus.ShowAll, //["showAll", "showActive", "showDone"]
    };
    // bind section
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  // Enterで追加用。addToDoで処理
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }
  // addEventListener用にDOMのイベントを追加
  handleKeyDown(e: React.KeyboardEvent | KeyboardEvent) {
    if (e.key === "Enter") {
      this.addToDo();
    }
  }
  handleDescriptionClick = (): void => {
    console.log("desc");
    this.setState((state) => {
      return {
        showDescription: !state.showDescription,
      };
    });
  };
  addToDo() {
    const state = this.state;
    // 初期メッセージなら空白を挿入
    const todoText = state.input;
    const todoObj: ToDoList = {
      value: todoText,
      isDone: false,
      key: Date.now().toString(),
    };
    this.setState({
      input: "",
      todoList: [...state.todoList, todoObj],
    });
  }
  handleInputChange(e: React.KeyboardEvent<HTMLInputElement>) {
    this.setState((state) => {
      return {
        input: e.currentTarget.value,
      };
    });
  }
  clearForm() {
    this.setState({
      input: "",
    });
  }
  handleToDoClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (e.currentTarget == null) {
      return;
    }
    const target = e.currentTarget;
    const index = this.state.todoList.findIndex((todo) => {
      return todo.key === e.currentTarget.id;
    });
    let newToDoList = [...this.state.todoList];
    // DeleteBtn Iはファビコン
    if (target.id === "deleteBtn" || target.className === "fa fa-close") {
      let modifiedToDoList = newToDoList.slice();
      let deletedToDo = newToDoList.splice(index, 1);
      this.setState((state) => {
        return {
          todoList: modifiedToDoList,
        };
      });
    } else {
      newToDoList[index].isDone = !newToDoList[index].isDone;
      this.setState((state) => {
        return {
          todoList: newToDoList,
        };
      });
    }
  }
  handleShowStatusClick(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.currentTarget;
    const instructionID = target.id;
    let newShowStatus: ShowStatus;
    switch (instructionID) {
      case "showAll":
        newShowStatus = ShowStatus.ShowAll;
        break;
      case "showActive":
        newShowStatus = ShowStatus.ShowActive;
        break;
      case "showDone":
        newShowStatus = ShowStatus.ShowDone;
        break;
      default:
        return;
    }
    this.setState(() => {
      return {
        showStatus: newShowStatus,
      };
    });
  }
  eliminateDone() {
    this.setState((state) => {
      return {
        todoList: state.todoList.filter((todo) => {
          return !todo.isDone;
        }),
      };
    });
  }

  render() {
    // categorize done or undone with map
    let modifiedToDoList = this.state.todoList.slice();
    if (this.state.showStatus === ShowStatus.ShowActive) {
      modifiedToDoList = modifiedToDoList.filter((todo) => {
        return !todo.isDone;
      });
    } else if (this.state.showStatus === ShowStatus.ShowDone) {
      modifiedToDoList = modifiedToDoList.filter((todo) => {
        return todo.isDone;
      });
    } else {
      // isDone===trueを後ろにする
      modifiedToDoList.sort((fE, sE) => {
        // sE未完 => fE完
        if (fE.isDone > sE.isDone) {
          return 1;
          // fE未完 => sE完
        } else if (fE.isDone < sE.isDone) {
          return -1;
        }
        return 0;
      });
    }

    return (
      <div id="todoWrapper">
        <Header
          handleDescriptionClick={this.handleDescriptionClick}
          showDescription={this.state.showDescription}
        />
        <Generator
          inputValue={this.state.input}
          onInputChange={this.handleInputChange.bind(this)}
          addToDo={this.addToDo.bind(this)}
          clearForm={this.clearForm.bind(this)}
        />
        <Controller
          handleShowStatusClick={this.handleShowStatusClick.bind(this)}
          eliminateDone={this.eliminateDone.bind(this)}
        />
        <Container
          todoList={modifiedToDoList}
          handleToDoClick={this.handleToDoClick.bind(this)}
        />
      </div>
    );
  }
}

class Header extends React.Component<ToDoProps> {
  render() {
    return (
      <div className="headerWrapper">
        <header>
          <h1 id="title">TypeReact-To-Do</h1>
          <nav id="headerNav">
            <ul>
              <li
                className="DrowingButton"
                onClick={this.props.handleDescriptionClick}
              >
                <i className="fa fa-info-circle "></i>
                <div className="headerNavDetail">このアプリについて</div>
              </li>
            </ul>
          </nav>
        </header>
        <Description
          style={{
            display: this.props.showDescription ? "block" : "none",
          }}
        />
      </div>
    );
  }
}
class Description extends React.Component<ToDoProps> {
  render() {
    return (
      <div id="description" style={this.props.style}>
        <div>
          Flex-To-Doは簡潔でわかりやすさを徹底してつくられたリマインダーアプリです。
          <br />
          著者： <em>YukiYama</em>
        </div>
        <div>
          <h2>このアプリの特徴</h2>
          いたってシンプルなタスク管理アプリで、以下の機能を持ちます。
          <ul>
            <li>EnterキーによるToDoの追加(PCのみ)</li>
            <li>入力欄への自動フォーカス</li>
            <li>ToDoの表示切り替え</li>
          </ul>
        </div>
      </div>
    );
  }
}
class Generator extends React.Component<ToDoProps> {
  render() {
    return (
      <div id="todoGenerator">
        <input
          type="text"
          value={this.props.inputValue}
          onChange={() => this.props.onInputChange}
          placeholder="Enterキーでも追加可能"
        />
        <button id="ctdAdd" onClick={() => this.props.addToDo}>
          追加
        </button>
        <button id="clearFormBtn" onClick={() => this.props.clearForm}>
          クリア
        </button>
      </div>
    );
  }
}
class Container extends React.Component<ToDoProps> {
  render() {
    console.log(this.props.todoList);
    return (
      <ul id="container">
        {this.props.todoList != null ? (
          this.props.todoList.map((todo, i) => (
            <li
              className="todoElement"
              key={todo.key}
              // in order to glab key value
              id={todo.key}
              data-isdone={todo.isDone.toString()}
              onClick={(e) => this.props.handleToDoClick}
            >
              <input
                type="checkbox"
                checked={todo.isDone ? true : false}
                readOnly
              />
              <span>{todo.value ? todo.value : "名無しのToDo"}</span>
              <button id="deleteBtn">
                <i className="fa fa-close" />
              </button>
            </li>
          ))
        ) : (
          <li>表示するToDoがありません。</li>
        )}
      </ul>
    );
  }
}
class Controller extends React.Component<ToDoProps> {
  render() {
    return (
      <div id="todoController">
        <ul id="showStatus" onClick={() => this.props.handleShowStatusClick}>
          <li id="showAll">すべて</li>
          <li id="showActive">未完のみ</li>
          <li id="showDone">完了のみ</li>
        </ul>
        <div id="clearDone" onClick={() => this.props.eliminateDone}>
          完了したものを消す
        </div>
      </div>
    );
  }
}

export default ToDo;
