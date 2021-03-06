import AbstractRegistrableComponent from './AbstractRegistrableComponent';
import ComponentType from '../enum/ComponentType';

export default {
	name: 'AbstractTransitionComponent',
	extends: AbstractRegistrableComponent,
	beforeCreate() {
		this.componentType = ComponentType.TRANSITION_COMPONENT;
		this.transitionController = null;
	},
	methods: {
		/**
		 * @public
		 * @method checkComponentsReady
		 * @description This method checks if all components are loaded on init, overwrite if you need multiple checks!
		 * @param component
		 * @returns {void}
		 */
		checkComponentsReady() {
			if (this.components.length === 0 && !this.transitionController) {
				this.allComponentsReadyResolveMethod();
			}
		},
		/**
		 * @public
		 * @method componentReady
		 * @description This method is a callback for when the child component is ready, it should be added
		 * to the .vue template (<ComponentA @componentReady="componentReady"/>)
		 * @param component
		 * @returns {void}
		 */
		componentReady(component) {
			// Store the reference
			this.registeredComponents.push(component);
			// Check if we reached the total amount of transition components
			if (this.components.length === this.registeredComponents.length && !this.transitionController) {
				this.allComponentsReadyResolveMethod();
			}
		},
		/**
		 * @public
		 * @method transitionIn
		 * @description The main transitionIn method for the component
		 * @param { boolean } forceTransition
		 * @returns {Promise<any>}
		 */
		transitionIn(forceTransition) {
			return this.allComponentsReady
				.then(() => this.transitionController.transitionIn(forceTransition));
		},
		/**
		 * @public
		 * @method transitionOut
		 * @description The main transitionOut method for the component
		 * @param { boolean } forceTransition
		 * @returns {Promise<any>}
		 */
		transitionOut(forceTransition) {
			return this.transitionController.transitionOut(forceTransition);
		},
	},
	beforeDestroy() {
		if (this.transitionController) {
			this.transitionController.dispose();
			this.transitionController = null;
		}
	},
};
