class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (arguments.length !== 0) {
            this.config = config;

            this.state = config.initial;
            this.forwardHistory = ['normal'];
            this.backwardHistory = [];
        } else {
            throw new Error('Missing argument in constructor');
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (state in this.config.states) {
            this.forwardHistory.push(state);
            this.state = state;
            this.backwardHistory = [];
        } else {
            throw new Error();
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let curTransitions = this.config.states[this.state].transitions;
        if (event in curTransitions) {
            this.changeState(curTransitions[event]);
            this.backwardHistory = [];
        } else {
            throw new Error();
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState(this.config.initial);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let resultArray = [];
        let states = this.config.states;
        if (!!event) {
            for (let state in states) {
                let tr = states[state].transitions;
                if (event in tr) {
                    resultArray.push(state);
                }
            }
        }
        else {
            for (let state in states) {
                resultArray.push(state);
            }
        }
        return resultArray;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        const length = this.forwardHistory.length;
        if (length === 1) {
            return false;
        }
        else {
            this.backwardHistory.push(this.forwardHistory.pop());
            this.state = this.forwardHistory[length - 2];
            return true;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        const length = this.backwardHistory.length;
        if(length === 0){
            return false;
        }
        else {
            let newState = this.backwardHistory.pop();
            this.forwardHistory.push(newState);
            this.state = newState;
            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.backwardHistory = [];
        this.forwardHistory = [];
        this.forwardHistory.push('normal');
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/

var config = {
    initial: 'normal',
    states: {
        normal: {
            transitions: {
                study: 'busy',
            }
        },
        busy: {
            transitions: {
                get_tired: 'sleeping',
                get_hungry: 'hungry',
            }
        },
        hungry: {
            transitions: {
                eat: 'normal'
            },
        },
        sleeping: {
            transitions: {
                get_hungry: 'hungry',
                get_up: 'normal',
            },
        },
    }
};



