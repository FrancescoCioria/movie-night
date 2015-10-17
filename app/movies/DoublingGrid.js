import React from 'react';

const englishNumbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen'];

export default React.createClass({

  propTypes: {
    elements: React.PropTypes.array.isRequired,
    columns: React.PropTypes.number,
    className: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      columns: 4,
      className: ''
    };
  },

  getRows() {
    const { elements, columns } = this.props;
    const columnWidth = englishNumbers[columns - 1];
    const rowsElements = elements.reduce((acc, el, i) => {
        const rowNumber = Math.floor(i / columns) + 1;
        if (rowNumber > acc.length) {
          acc.push([]);
        }

        const column = <div className='column' key={i}>{el}</div>;
        acc[rowNumber - 1].push(column);
        return acc;
      },
      []
    );

    const classes = 'doubling ' + columnWidth + ' column row';
    return rowsElements.map((row, i) => <div className={classes} key={i}>{row}</div>);
  },

  render() {
    const { elements, className } = this.props;
    if (elements.length === 0) {
      return <h1 className='empty'>EMPTY</h1>;
    }
    return (
      <div className={'ui ' + className + ' grid'}>
        {this.getRows()}
      </div>
    );
  }

});
