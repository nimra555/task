import React, { useState, useMemo } from 'react'
import TinderCard from 'react-tinder-card'
import Data from '../data.json';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
      maxWidth: 345,
      margin:'auto',
    },
    media: {
      height: 140,
    },
   
});

const alreadyRemoved = []
let charactersState = Data // This fixes issues with updating characters state forcing it to use the current state and not the state that was active when the card was created.

function CardTinder () {
  const classes = useStyles();  
  const [characters, setCharacters] = useState(Data)
  const [lastDirection, setLastDirection] = useState()
  const [likeimages,setLikeImages] = useState([]);
  const [dislikeimages,setDisLikeImages] = useState([]);


  const childRefs = useMemo(() => Array(Data.length).fill(0).map(i => React.createRef()), [])

  const swiped = (direction, nameToDelete) => {
    console.log('removing: ' + nameToDelete)
    setLastDirection(direction)
    alreadyRemoved.push(nameToDelete)
  }

  const outOfFrame = (thumbnailUrl) => {
    console.log(thumbnailUrl + ' left the screen!')
    charactersState = charactersState.filter(character => character.thumbnailUrl !== thumbnailUrl)
    setCharacters(charactersState)
  }

  const swipe = (dir,imgSrc) => {
    const cardsLeft = characters.filter(person => !alreadyRemoved.includes(person.thumbnailUrl))
    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].thumbnailUrl // Find the card object to be removed
      const index = Data.map(person => person.thumbnailUrl).indexOf(toBeRemoved) // Find the index of which to make the reference to
      alreadyRemoved.push(toBeRemoved) // Make sure the next card gets removed next time if this card do not have time to exit the screen
      childRefs[index].current.swipe(dir) // Swipe the card!
      setLikeImages((prev) => [...prev,imgSrc]);
      setDisLikeImages((previous) => [...previous,imgSrc]);
    }
  }

  return (
    <div>
      <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
      <link href='https://fonts.googleapis.com/css?family=Alatsi&display=swap' rel='stylesheet' />
      <Typography component="h2">React Tinder Card</Typography>
      <Card className={classes.root}>
          {/* character which equal to data is mapping  */}
        {characters.map((character, index) =>
          <TinderCard ref={childRefs[index]} className='swipe' key={character.id} onSwipe={(dir) => swiped(dir, character.thumbnailUrl)} onCardLeftScreen={() => outOfFrame(character.thumbnailUrl)}>
            <CardMedia style={{ backgroundImage: 'url(' + character.url + ')' }}    className={classes.media}>
              <img src={character.thumbnailUrl} alt="image"/>
            </CardMedia>
          </TinderCard>
        )}
      </Card>
      <div className='buttons'>
        <Button color="primary" variant="contained" style={{margin:'15px'}} 
        onClick={() => swipe('like','src')}>LIKE</Button>
        <Button color="primary" variant="contained" onClick={() => swipe('dislike','src')}>DISLIKE</Button>
        {/* both button use onclick aand first parameter is direction and second for img src */}
      </div>
      {lastDirection ? <h2 key={lastDirection} className='infoText'>You  {lastDirection}</h2> : <h2 className='infoText'>Swipe a card or press a button to get started!</h2>}
      {/* lastDirection show thedirection */}
      {likeimages.map(img => {
          <>
          <h1>Like Images</h1>
          <img src={img} alt="images"/>
           </> 
      })}
      {dislikeimages.map(image => {
          <>
          <h1>DisLike Images</h1>
          <img src={image} alt="images"/>
           </>   
      })} 
      {/* like and dislike image both not shown in browser */}
    </div>
  )
};

export default CardTinder;

