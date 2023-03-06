import Header from '../Header';
import Main from '../Main';
import Footer from '../Footer';
import React from 'react';
import nextId from 'react-id-generator';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

export default class App extends Component {
  state = {
    tasksData: [], 
    isSelected: 'all',
  };

  componentDidMount() {
    this.setState({
      tasksData: JSON.parse(localStorage.getItem('tasksData')) || [],
    });
  }

  componentDidUpdate(prevProps, prevstate) {
    if (
      JSON.stringify(this.state.tasksData) !=
      JSON.stringify(localStorage.getItem('tasksData'))
    ) {
      localStorage.setItem(
        'tasksData',
        JSON.stringify(this.state.tasksData),
      );
    }
  }

  handleTaskDelete = ({ _id }) => {
    this.setState(({ tasksData }) => {
      const filteredTaskData = tasksData.filter(
        (el) => el._id !== _id,
      );
      return { tasksData: filteredTaskData };
    });
  };

  handleAddCard = ({ cardText, fullTime }) => {
    const newCard = {};
    newCard.totalTime = fullTime;
    newCard.taskText = cardText;
    newCard._id = nextId();
    newCard.created = `${formatDistanceToNow(new Date())}`;
    newCard.status = true;
    this.setState(({ tasksData }) => {
      return { tasksData: [newCard, ...tasksData] };
    });
  };

  handleTaskDone = ({ _id, newTime }) => {
    const { tasksData } = this.state;

    const newToDo = tasksData.filter((elem) => {
      if (elem._id === _id) {
        if (elem.status) {
          elem.status = false;
        } else {
          elem.status = true;
        }
        elem.totalTime = newTime;
      }

      return elem;
    });

    this.setState({
      tasksData: newToDo,
    });
  };

  clearCompletedToDo = () => {
    const { tasksData } = this.state;

    const newTasksData = tasksData.filter((el) => el.status);
    this.setState({
      tasksData: newTasksData,
    });
  };

  toDoFilter = (status) => {
    this.setState({
      isSelected: status,
    });
  };

  handleTaskEdit = (_id, title) => {
    const { tasksData } = this.state;

    const newToDo = tasksData.filter((elem) => {
      if (elem._id === _id) {
        elem.taskText = title;
      }
      return elem;
    });

    this.setState({
      tasksData: newToDo,
    });

    localStorage.setItem('tasksData', JSON.stringify(tasksData));
  };

  saveTimerTime = (_id, newTime) => {
    const { tasksData } = this.state;
    const newToDo = tasksData.filter((elem) => {
      if (elem._id === _id) {
        elem.totalTime = newTime;
      }
      return elem;
    });

    this.setState({
      tasksData: newToDo,
    });
  };

  render() {
    const { isSelected, tasksData } = this.state;
    let filteredData = [];
    if (
      typeof isSelected === 'string' &&
      isSelected.toLowerCase() === 'all'
    ) {
      filteredData = tasksData;
    } else if (isSelected) {
      filteredData = tasksData.filter((elem) => elem.status);
    } else {
      filteredData = tasksData.filter((elem) => !elem.status);
    }

    return (
      <div className="todoapp">
        <Header handleAddCard={(data) => this.handleAddCard(data)} />
        <Main
          tasksData={filteredData}
          handleTaskDelete={({ _id }) =>
            this.handleTaskDelete({ _id })
          }
          handleTaskDone={({ _id }) => this.handleTaskDone({ _id })}
          handleTaskEdit={(_id, title) =>
            this.handleTaskEdit(_id, title)
          }
          saveTimerTime={(_id, newTime) =>
            this.saveTimerTime(_id, newTime)
          }
        />
        <Footer
          toDoFilter={(status) => this.toDoFilter(status)}
          clearCompletedToDo={() => this.clearCompletedToDo()}
          tasksData={filteredData}
          isSelected={isSelected}
        />
      </div>
    );
  }
}