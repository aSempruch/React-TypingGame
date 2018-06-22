import React, { Component } from 'react';
import './App.css';
import { TextField, AppBar, Toolbar, Typography, Paper } from '@material-ui/core'

class App extends Component {

  state = {
    currentIndex: 0,
    currentWordProg: '',
    wordCount: 15,
    text: 'How much wood would a wood chuck chuck if a wood chuck could chuck wood',
  }

  action = {
    updateWordProg: (val) => { this.setState({currentWordProg: val}) },
    updateIndex: (val) => { this.setState({currentIndex: val}) },
    getWordProg: _ => ( this.state.currentWordProg ),
    getIndex: _ => ( this.state.currentIndex ),
    getText: _ => ( this.state.text ),
  }

  render() {
    return (
      <div>
        <MyAppBar/>
        <Paper id='GameContainer'>
          <GameTextBox action={ this.action }/>
          <TypeBox action={ this.action }/>
        </Paper>
      </div>
    );
  }
}

class MyAppBar extends Component {
  render(){
    return(
      <AppBar>
        <Toolbar>
          <Typography variant='title' color='inherit'>
            Typing Game
          </Typography>
        </Toolbar>
      </AppBar>
    )
  }
}

class GameTextBox extends Component {

  renderText = _ => {
    const { action } = this.props;
    const currentIndex = action.getIndex(), currentWord = action.getWordProg(), text = action.getText();
    var result = [];
    result.push(<span id='Typed' key='typed'><u>{text.substring(0, currentIndex)}</u></span>);
    if(currentIndex < currentWord.length){
      console.log('render => incorrect')
      result.push(<span id='Incorrect' key='incorrect'><u>{text.substring(currentIndex, currentWord.length)}</u></span>);
    }
    result.push(<span id='Untyped' key='untyped'>{text.substring(currentWord.length, text.length)}</span>);
    return result;
  }

  render(){
    const { renderText } = this;
    return(
      <div id='GameTextBox'>
        {renderText()}
      </div>
    )
  }
}

class TypeBox extends Component {

  state = {
    value: '',
  }

  handleChange = (e) => {
    const { action } = this.props;
    this.setState({value: e.target.value});
    const currentIndex = action.getIndex(), currentWord = e.target.value, text = action.getText();

    /* Backspace */
    if(currentWord.length < action.getWordProg().length){
      console.log("Backspace");
      action.updateIndex(currentWord.length);
      action.updateWordProg(currentWord);
    }
    /* New Text Matches Target Text */
    else if(currentWord.substring(currentIndex) === text.substring(currentIndex, currentWord.length)){
      console.log("Match");
      action.updateIndex(currentWord.length)
      action.updateWordProg(currentWord)
    }
    /* New Text is Wrong */
    else{
      console.log("Incorrect");
      action.updateWordProg(currentWord);
    }
  }

  render(){
    const { handleChange } = this;
    const { value } = this.state;
    return(
      <TextField
        id='TypeBox'
        label='Type!'
        value={value}
        onChange={handleChange}
      />
    )
  }
}

export default App;
