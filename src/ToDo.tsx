import React from "react";
import "./ToDo.css";

// declare interface type
interface Props {
  
}
interface State{
  todoList: {[key:string]: Array<string>}
}

class ToDo extends React.Component {
  constructor(props: Object) {
    super(props);
    this.state = {
      todoList: [],
    };
  }
  render() {
    return <Header />;
    // <Generator />
    // <Container />
  }
}

class Header extends React.Component {
  constructor(props: Object) {
    super(props);
    this.state:Object = {
      showDescription: false,
    };
  }
  toggleDescription(e: Event): void {
    this.setState((state: Object) => ({
      showDescription: !state.showDescription,
    }));
  }
  render() {
    return (
      <header>
        <h1 id="title">TypeReact-To-Do</h1>
        <nav id="headerNav">
          <ul>
            <li className="DrowingButton" id="about">
              <i className="fa fa-info-circle "></i>
              <div onClick={this.toggleDescription} className="headerNavDetail">
                このアプリについて
              </div>
            </li>
          </ul>
        </nav>
        <Description bool={this.state.showDescription ? "" : "hidden"} />
      </header>
    );
  }
}
class Description extends React.Component {
  render() {
    return (
      <div id="description" className={this.props.showDescription}>
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

export { ToDo };
