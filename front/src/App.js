import React, { Component } from 'react';
import './App.css';
import { TextField, AppBar, Toolbar, Typography, Paper, Dialog, DialogContent } from '@material-ui/core'

class App extends Component {

  state = {
    currentIndex: 0,
    currentWordProg: '',
    wordCount: 15,
    text: 'How much wood would a wood chuck chuck if a wood chuck could chuck wood', //Text statically set. I know, it's lame, but I ran out of time
  }

  action = {
    updateWordProg: (val) => { this.setState({currentWordProg: val}) },
    updateIndex: (val) => {
      if(val === this.state.text.length){
        console.log('Ending Timer');
        this.setState({endTime: new Date()})
      } 
      this.setState({currentIndex: val}) 
    },
    getWordProg: _ => ( this.state.currentWordProg ),
    getIndex: _ => ( this.state.currentIndex ),
    getText: _ => ( this.state.text ),
    startTimer: _ => { this.setState({startTime: new Date()}) },
  }

  render() {
    const { startTime, endTime, text } = this.state;
    return (
      <div>
        <Dialog open={(this.state.endTime !== undefined)}>
          <DialogContent>
            Words per Minute: {Math.round(text.split(' ').length / ((endTime-startTime)/60000))}
          </DialogContent>
        </Dialog>
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
    if(currentIndex < currentWord.length)
      result.push(<span id='Incorrect' key='incorrect'><u>{text.substring(currentIndex, currentWord.length)}</u></span>);
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
    init: false,
  }

  handleChange = (e) => {
    const { action } = this.props;
    if(!this.state.init){
      console.log('Starting Timer');
      action.startTimer();
      this.setState({init: true});
    }
    const currentIndex = action.getIndex(), currentWord = e.target.value, text = action.getText(), oldWord = action.getWordProg();
    /* Do not allow edits of previous characters and pasting multiple characters into textfield */
    if((currentWord.substring(0, currentWord.length) !== oldWord.substring(0, oldWord.length-1) && currentWord.length < oldWord.length) || 
      (currentWord.length-oldWord.length > 1))
      return;
    this.setState({value: e.target.value});

    /* New Text Matches Target Text */
    if(currentWord === text.substring(0, currentWord.length)){
      /* Backspace */
      if(currentWord.length < oldWord.length){
        action.updateIndex(currentWord.length);
        action.updateWordProg(currentWord);
      }
      else{
        action.updateIndex(currentWord.length)
        action.updateWordProg(currentWord)
      }
    }
    /* New Text is Wrong */
    else{
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
