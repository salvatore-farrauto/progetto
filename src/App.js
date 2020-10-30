import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';




class Post extends React.Component {

  render() {
    return (
      <div className="postContainer">
        <div className={(this.props.featured == true) ? "featured" : "noFeatured"}>
          <div className="author">Autore: {this.props.author}</div>
          <div className="title">Titolo: {this.props.title}</div>
          <div className="subtitle">Sottotitolo: {this.props.subtitle}</div>
          <div className="createdDatePost">Data Creazione Post: {this.props.createdDatePost}</div>
          <div className="bodyPost">{this.props.body}</div>
        </div>

        <h6>Area Commenti</h6>

        {this.props.commentsToShow}


      </div>
    )
  }
}


class Comment extends React.Component {

  // urlComments= "https://backend-blog-experis.herokuapp.com/comments"


  render() {
    return (
      <div className="commentContainer">
        <span className="author">Da {this.props.author}</span>
        <span className="dataContainer">Scritto il: {this.props.createdDate}</span>
        <div className="body">{this.props.body}</div>
      </div>
    )
  }
}



class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { posts: [], comments: [], loadingComments: true, loadingPosts: true }
    this.selectCommentsForAPost = this.selectCommentsForAPost.bind(this)
    this.displayAll = this.displayAll.bind(this)

  }

  componentDidMount() {

    // fetching comments
    fetch('https://backend-blog-experis.herokuapp.com/comments')
      .then(res => res.json())
      //.then(data => { console.log(data[0].body) })
      .then(data => this.setState({ comments: data }))
      //.then(console.log)
      .then(() => { this.setState({ loadingComments: false }) })
      .catch(err => console.error(err));


    // fetching posts:
    fetch('https://backend-blog-experis.herokuapp.com/posts')
      .then(res => res.json())
      .then(data => this.setState({ posts: data }))
      .then(() => { this.setState({ loadingPosts: false }) })
      .catch(err => console.error(err));

  }



  selectCommentsForAPost(idPost) {  // returns the list of JSX objects of comments
    // relative to idPost
    let arr = []
    for (let k = 0; k < this.state.comments.length; k++) {
      if (this.state.comments[k].belongingPostID == idPost) {
        var commentObject = this.state.comments[k]
        if (commentObject.invisible == false) {
          arr.push(<Comment key={k} author={commentObject.commentUser}
            createdDate={commentObject.Created_date} body={commentObject.body} />)
        }
      }
    }
    return arr
  }


  displayAll() {
    let arr = []
    for (let k = 0; k < this.state.posts.length; k++) {

      let postObject = this.state.posts[k]

      if (postObject.public == true) {
        let commentsRelated = this.selectCommentsForAPost(postObject._id) // This is 
        // A list of JSX elements comments.

        arr.push(<Post key={k} author={postObject.author} createdDatePost={postObject.Created_date}
          bodyPost={postObject.body} featured={postObject.featured}
          subtitle={postObject.subtitle} title={postObject.title}
          commentsToShow={commentsRelated} />)
      }
    }


    // It only misses to order the array of posts.
    // Inoltre i posts sono ordinati al contrario. Prima c'è quello più vecchio..

    return arr // è un array di JSX
  }



  render() {
    if (this.state.loadingComments == false || this.state.loadingPosts == false) {
      return (
        <div>
          <header className="title"> Questo è il blog finale </header>
          <hr></hr>
          <span className="introD"> Ora gli articoli. Prima quelli più belli </span>
          {this.displayAll()}
        </div>
      )
    } else {
      return (
        <div>
          Loading...
        </div>
      )
    }
  }
}

export default App;


// Cose imparate: rendere un componente più volte con un for. 
// Non si può mettere for: return
// Nè return e poi for
// Ma si fa con un array e pusho il componente dentro (con le props)

// Seconda cosa è il loading. Si fa il fetch in component did mount