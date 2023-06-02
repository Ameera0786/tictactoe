import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://elcfvoujpelpwbufwyze.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsY2Z2b3VqcGVscHdidWZ3eXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgzODk4OTAsImV4cCI6MTk5Mzk2NTg5MH0.UZSUFFiAD2vcFSDP_aYdFawaQNlSol8b6yqBTSbbcS4"
const supabase = createClient(supabaseUrl, supabaseKey)
const db = 'scores_data'

let getScore1 = await getScore_double_player1()
let getScore2 = await getScore_double_player2()

// FOR THE DOUBLE GAME
async function getScore_double_player1() {
  const { data, error } = await supabase
    .from(db)
    .select('id,scores1_player')
    .limit(1)
    .single()

  return data
}
// FOR THE DOUBLE GAME
async function updateScore_double_player1() {

  const { error } = await supabase
    .from(db)
    .update({ scores1_player: score1 })
    .eq('id', getScore1['id'])
}
// FOR THE DOUBLE GAME
async function getScore_double_player2() {
  const { data, error } = await supabase
    .from(db)
    .select('id,scores2_player')
    .limit(1)
    .single()

  return data
}
// FOR THE DOUBLE GAME
async function updateScore_double_player2() {

  const { error } = await supabase
    .from(db)
    .update({ scores2_player: score2 })
    .eq('id', getScore2['id'])
}

// Start game
async function start() {
  // Resets scores and board
  button_score.addEventListener("click", async (event) => {
    score1 = 0
    score2 = 0
    await updateScore_double_player1(score1)
    await updateScore_double_player2(score2)
    await getScore_double_player1()
    await getScore_double_player2()
    window.location.reload()
  })

  // Reset board/play again
  button_board.addEventListener("click", () => {
    window.location.reload()
  })


  // BACKUP
//   boxes.forEach(box => {
//     box.addEventListener("click", () => {
//       add(box.id.slice(-1))
//     }, { once: true })
//   })
// }


  // AddEventListener and run function for cell clicked- run only once
  for (let i=1;i<=boxes.length;i++){
    document.getElementById("box" + i).addEventListener("click",()=>{
      add(i)
    },{once:true})
  }
}


// // Add X or O to the selected cell
function add(number) {

  // Gets out of function overall
  if (finish) {
    return
  }
  count++

  // Runs if game isn't at tie
  if (count <= 9) {

    // Specific to player
    if (turn % 2 != 0) {

      // Clones
      let update_circle = circle.cloneNode(true)

      // Updates div
      document.getElementById('box' + number).appendChild(update_circle)
      boxes[number] = ('O')
      player.innerHTML = "Player 1's turn: Crosses go"
    } else {

      // Clones
      let update_cross = cross.cloneNode(true)

      // Updates div
      document.getElementById('box' + number).appendChild(update_cross)
      boxes[number] = ('X')
      player.innerHTML = "Player 2's turn: Circles go"
    }
  }
  turn++
  check()
}

// Checks if the combinations are true, if so, increases the player's score and displays winner
function check() {

  // Checks for cross
  if ((boxes[1] == "X" && boxes[4] == "X" && boxes[7] == "X") || (boxes[2] == "X" && boxes[5] == "X" && boxes[8] == "X") || (boxes[3] == "X" && boxes[9] == "X" && boxes[6] == "X") || (boxes[1] == "X" && boxes[5] == "X" && boxes[9] == "X") || (boxes[3] == "X" && boxes[5] == "X" && boxes[7] == "X") || (boxes[1] == "X" && boxes[2] == "X" && boxes[3] == "X") || (boxes[4] == "X" && boxes[5] == "X" && boxes[6] == "X") || (boxes[7] == "X" && boxes[8] == "X" && boxes[9] == "X")) {

    // Update score and show who won
    player.innerHTML = "Cross wins!"
    score1++
    updateScore_double_player1(score1)
    finish = true

    win1.innerHTML = "Player 1 Wins: " + score1
    return
    // Checks for circle
  }
  if ((boxes[1] == "O" && boxes[4] == "O" && boxes[7] == "O") || (boxes[2] == "O" && boxes[5] == "O" && boxes[8] == "O") || (boxes[3] == "O" && boxes[9] == "O" && boxes[6] == "O") || (boxes[1] == "O" && boxes[5] == "O" && boxes[9] == "O") || (boxes[3] == "O" && boxes[5] == "O" && boxes[7] == "O") || (boxes[1] == "O" && boxes[2] == "O" && boxes[3] == "O") || (boxes[4] == "O" && boxes[5] == "O" && boxes[6] == "O") || (boxes[7] == "O" && boxes[8] == "O" && boxes[9] == "O")) {

    // Update score and show who won
    player.innerHTML = "Circle wins!"
    score2++
    updateScore_double_player2(score2)
    win2.innerHTML = "Player 2 Wins: " + score2

    finish = true
    return

    // Checks tie
  }
  if (count == 9) {
    player.innerHTML = "Tie"
  }
}

// // Set up- rows is a lit of all divs with id's including "row".
let boxes = Array.from(document.querySelectorAll("[id^='box']"))
let score1 = getScore1["scores1_player"]
let score2 = getScore2["scores2_player"]
let count = 0
let turn = 0
let finish = false
const player = document.querySelector("#player_turn")
const win1 = document.querySelector("#scores1")
const win2 = document.querySelector("#scores2")
const button_score = document.querySelector("#reset_score")
const button_board = document.querySelector("#reset_board")
const circle = document.createElement("img")
const cross = document.createElement("img")
cross.src = "https://www.freeiconspng.com/thumbs/x-png/x-png-15.png"
circle.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Red_circle.svg/768px-Red_circle.svg.png"
player.innerHTML = "Player 1's turn: Crosses go"
win1.innerHTML = "Player 1 Wins: " + score1
win2.innerHTML = "Player 2 Wins: " + score2

start()



// ****REFERENCE CODES
// https://stackoverflow.com/questions/26625336/find-elements-using-part-of-id
// https://www.w3schools.com/jsref/met_node_clonenode.asp
// https://www.w3schools.com/jsref/jsref_slice_array.asp
// https://www.samanthaming.com/tidbits/83-4-ways-to-convert-string-to-character-array/
// https://www.reddit.com/r/learnjavascript/comments/6swml4/identifier_insert_let_variable_has_already_been/