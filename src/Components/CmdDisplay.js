import { router, setScript, setState, states } from '../Kori/Kori';
import '../styles/Cmd.css'
import { getDisplayLists } from '../utils/getDisplayLists.js';
import { isValidCommand } from '../utils/isValidCommand.js';
import DisplayLists from './DisplayLists';
import Help from './Help.js';


setState(
  'CmdDisplay',
  {
    isFocus: false,
    isBlur: true,
    isInputHasValue: false,
    inputValue: '',
    commands: ['Help', 'Go to', 'Display *'],
    commandLists: [
      { command: 'Goto', desc: 'Go to pages', eg: 'Goto /home' },
      { command: 'Display', desc: 'Display lists of Options[Pages, Games, Projects]', eg: 'Display Pages' },
      { command: 'Play', desc: 'Play a game', eg: 'Play Snake' },
      { command: 'Clear', desc: 'Clear Console', eg: 'Clear' },
    ],

    prefixLists: ['Pages', 'Games', 'Projects'],
    resultLists: []
  },
)



setScript(
  "CmdDisplay",
  {

    onChange: (e) => {
      setState(
        'CmdDisplay',
        {
          isInputHasValue: e.target.value.length > 0 ? true : false,
          inputValue: e.target.value
        }
      )
    },

    onFocus: () => {
      setState(
        'CmdDisplay',
        {
          isFocus: true,
          isBlur: false,
          isInputHasValue: true
        }
      )
    },


    onBlur: (e) => {
      setState(
        'CmdDisplay',
        {
          isFocus: false,
          isBlur: true,
          isInputHasValue: e.target.value.length > 0 ? true : false,
        }
      )
    },

    submit: (e) => {
      e.preventDefault()
      const targetValue = e.target[0].value.toLowerCase()
      if (getDisplayLists(targetValue)[0] === 'goto') {
        router(null, getDisplayLists(targetValue)[1])
      }

      const r = states.CmdDisplay.resultLists

      if (isValidCommand(targetValue)) {
        r.push(targetValue)
      }

      if (targetValue === 'clear') {
        r.length = []
      }

      setState(
        'CmdDisplay',
        {
          isInputHasValue: false,
          inputValue: targetValue,
          isFocus: false,
          isBlur: true,
          resultLists: r
        }
      )
      e.target[0].value = ""
      e.target[0].focus()

      if (getDisplayLists(targetValue)[0] === 'goto') {
        router(null, getDisplayLists(targetValue)[1])
      }
    }

  }
)


export const CmdDisplay = () => {


  return `
   <div class='w-full h-full p-[50px] '>
    <div class='bg-[gray] p-[2px]'>
     <div class='bg-black p-5 min-h-[50px] flex text-white'>
      <div class='flex'>
       <span>~Kori~$</span> 
       <p class=${!states.CmdDisplay.isFocus && states.CmdDisplay.isBlur && !states.CmdDisplay.isInputHasValue ? `pre-text` : `hidden`}>
       ➽
       </p>
      </div>

      <div>
       <form if-submit='CmdDisplay-submit'>
         <input id='int'
         placeholder='Type here'
         if-change='CmdDisplay-onChange'
         if-blur='CmdDisplay-onBlur'
         if-focus='CmdDisplay-onFocus'
         class="custom-input ml-1 focus:outline-none text-white"
         >
       </form>
      </div>
     </div>

     <div class='flex flex-col gap-[20px] bg-black min-h-[200px] p-5 text-white'>
      
    ${states.CmdDisplay.resultLists.length > 0 ? states.CmdDisplay.resultLists.map((item) => {
    return DisplayLists(getDisplayLists(item)[1])
  }).join('') : ''}
     </div>
     </div>
   </div> 
 `;
}

export default CmdDisplay;
