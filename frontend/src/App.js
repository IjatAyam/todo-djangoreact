import React, { Component } from 'react'
import Modal from "./components/Modal"
import axios from "axios"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false,
      viewCompleted: false,
      activeItem: {
        title: "",
        description: "",
        completed: false
      },
      todoList: []
    }
    this.itemCategory = this.itemCategory.bind(this)
  }

  componentDidMount() {
    this.refreshList()
  }

  refreshList = () => {
    axios
      .get("/api/todos")
      .then(res => this.setState({ todoList: res.data }))
      .catch(err => console.log(err))
  }

  displayCompleted = status => {
    if (status === "all") {
      return this.setState({ viewCompleted: "all" })
    }
    if (status) {
      return this.setState({ viewCompleted: true })
    }

    return this.setState({ viewCompleted: false })
  }

  renderTablList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => this.displayCompleted("all")}
          className={(this.state.viewCompleted === "all") ? "active" : ""}>
          All
        </span>
        <span
          onClick={() => this.displayCompleted(true)}
          className={(this.state.viewCompleted && this.state.viewCompleted !== "all") ? "active" : ""}>
          Complete
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "" : "active"}>
          Incomplete
        </span>
      </div>
    )
  }

  renderItems = complete => {
    const newItems = this.state.todoList.filter(
      item => item.completed === complete
    )
    return newItems.map(item => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center">
        <span className={`todo-title mr-2 ${complete ? "completed-todo" : ""}`}
          title={item.description}>
          {item.title}
        </span>
        <span>
          <button
            onClick={() => this.editItem(item)}
            className="btn btn-secondary mr-2"
          >
            {" "}
            Edit{" "}
          </button>
          <button
            onClick={() => this.handleDelete(item)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </span>
      </li>
    ))
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal })
  }

  handleSubmit = item => {
    this.toggle()
    if (item.id) {
      axios
        .put(`/api/todos/${item.id}/`, item)
        .then(res => this.refreshList())
      return
    }
    axios
      .post("/api/todos/", item)
      .then(res => this.refreshList())
  }

  handleDelete = item => {
    axios
      .delete(`/api/todos/${item.id}`)
      .then(res => this.refreshList())
  }

  createItem = () => {
    const item = { title: "", description: "", completed: false }
    this.setState({ activeItem: item, modal: !this.state.modal })
  }

  editItem = item => {
    this.setState({ activeItem: item, modal: !this.state.modal })
  }

  itemCategory() {
    if (this.state.viewCompleted === "all") {
      return (
        <div>
          {this.renderItems(false)}
          {this.renderItems(true)}
        </div>
      )
    }
    return (
      <div>
        {this.state.viewCompleted ? this.renderItems(true) : this.renderItems(false)}
      </div>
    )
  }

  render = () => (
    <main className="content">
      <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
      <div className="row">
        <div className="col-md-6 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <div className="">
              <button onClick={this.createItem} className="btn btn-primary">
                Add task
              </button>
            </div>
            {this.renderTablList()}
            <ul className="list-group list-group-flush">
              <this.itemCategory />
            </ul>
          </div>
        </div>
      </div>
      {this.state.modal ? (
        <Modal
          activeItem={this.state.activeItem}
          toggle={this.toggle}
          onSave={this.handleSubmit}
        />
      ) : null}
    </main >
  )
}

export default App
