import PropTypes from 'prop-types';
import React from 'react';
import Timer from '../Timer';

export default class Task extends React.PureComponent {
  state = {
    totalValue: this.props.taskText, 
    change: null, 
  };

  handleAddCardSubmit = (evt) => {
    const { totalValue } = this.state;
    const { handleTaskEdit, _id } = this.props;

    evt.preventDefault();

    handleTaskEdit(_id, totalValue);
    this.setState({
      change: null,
    });
  };

  handleOpenEdit = (_id) => {
    this.setState({
      change: _id,
    });
  };

  handleNewValue = (evt) => {
    this.setState({
      totalValue: evt.target.value,
    });
  };

  render() {
    const { totalValue, change } = this.state;
    const {
      created,
      handleTaskDelete,
      _id,
      handleTaskDone,
      status,
      totalTime,
      saveTimerTime,
    } = this.props;
    return (
      <li className={!status ? 'completed' : ''}>
        <div className="view">
          {change === _id ? (
            <form onSubmit={this.handleAddCardSubmit}>
              <label>
              <input
                onChange={this.handleNewValue}
                value={totalValue}
              />
              </label>
              <label>
              <input type="submit" value="Сохранить" />
              </label>
            </form>
          ) : (
            <>
              <label>
              <input
                className="toggle"
                type="checkbox"
                defaultChecked={!status}
                onClick={() => handleTaskDone({ _id, totalTime })}
              />
              </label>
              <label>
                <span className="description">{totalValue}</span>
                <Timer
                  totalTime={totalTime}
                  _id={_id}
                  status={status}
                  saveTimerTime={saveTimerTime}
                />
                <span className="created">created {created} ago</span>
              </label>
              <button
                title="Edit"
                type="button"
                className="icon icon-edit"
                onClick={() => {
                  this.handleOpenEdit(_id);
                  saveTimerTime(_id, totalTime);
                }}
              />
              <button
                title="Delete"
                type="button"
                className="icon icon-destroy"
                onClick={() => handleTaskDelete({ _id })}
              />
            </>
          )}
        </div>
      </li>
    );
  }
}
Task.defaultProps = {
  taskText: '',
  created: '',
  handleTaskDelete: {},
  _id: '',
  handleTaskDone: {},
};

Task.propTypes = {
  taskText: PropTypes.string,
  created: PropTypes.string,
  handleTaskDelete: PropTypes.func,
  _id: PropTypes.string,
  handleTaskDone: PropTypes.func,
};