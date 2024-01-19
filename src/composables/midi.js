// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

// by convention, composable function names start with "use"
export function useMidi() {

  const midiHandler = ref(null);

  function onMIDISuccess(midiAccess) {
    console.log("MIDI ready!");
    midiHandler.value = midiAccess; // store in the global (in real usage, would probably keep in an object instance)
  }

  function onMIDIFailure(msg) {
    console.error(`Failed to get MIDI access - ${msg}`);
  }

  function connectMidi() {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  }

  function disconnectMidi() {
    midiHandler.value = null;
  }



  onMounted(() => connectMidi())
  onUnmounted(() => window.removeEventListener('mousemove', update))
}