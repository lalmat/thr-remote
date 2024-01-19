class MidiConnexion {
  constructor() {
    this.midi = null;
    this.connected = false;
    this.selectedInput = null;
    this.selectedOutput = null;
  }

  async connect() {
    try {
      this.midi = await navigator.requestMIDIAccess()
      this.connected = true;
      this.midi.onstatechange = (event) => {
        // Print information about the (dis)connected MIDI controller
        console.log("MIDI CHANGE", event.port.name, event.port.manufacturer, event.port.state);
      };

      this.setDefaultInput();
      this.debugMidiInput();

      this.setDefaultOutput();

    }
    catch (e) {
      this.connected = false;
      console.error('MIDI', e.message);
    }
  }

  setDefaultInput() {
    if (this.midi.inputs.length > 0)
      this.selectedInput = this.midi.inputs[0];
  }

  setDefaultOutput() {
    if (this.midi.outputs.length > 0)
      this.selectedInput = this.midi.outputs[0];
  }

  listInputsAndOutputs() {
    for (const entry of this.midi.inputs) {
      const input = entry[1];
      console.log(
        `Input port [type:'${input.type}']` +
        ` id:'${input.id}'` +
        ` manufacturer:'${input.manufacturer}'` +
        ` name:'${input.name}'` +
        ` version:'${input.version}'`,
      );
    }

    for (const entry of this.midi.outputs) {
      const output = entry[1];
      console.log(
        `Output port [type:'${output.type}'] id:'${output.id}' manufacturer:'${output.manufacturer}' name:'${output.name}' version:'${output.version}'`,
      );
    }
  }

  debugMidiInput() {
    this.midi.inputs.forEach((entry) => {
      entry.onmidimessage = null;
    });

    this.selectedInput.onmidimessage = (event) => {
      let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;
      for (const character of event.data) {
        str += `0x${character.toString(16)} `;
      }
      console.log(str);
    }
  }

  _sendMIDIMessage(message) {
    const output = this.midi.outputs.get(this.selectedOutput);
    output.send(message); // sends the message.
  }
}