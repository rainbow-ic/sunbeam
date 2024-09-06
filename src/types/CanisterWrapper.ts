import { Identity, HttpAgent } from "@dfinity/agent";

export type CanisterWrapperInitArgs = { id: string; agent: HttpAgent };

export class CanisterWrapper {
    protected id: string;
    protected agent: HttpAgent;

    constructor({ id, agent }: CanisterWrapperInitArgs) {
        this.id = id;
        this.agent = agent;
    }

    /**
     * Replaces the current identity of the CanisterWrapper instance with a new one.
     *
     * @param {Identity} identity - The new identity to be set.
     * @returns {CanisterWrapper} - Returns the current instance of CanisterWrapper for chaining.
     */
    setIdentity(identity: Identity): CanisterWrapper {
        this.agent.replaceIdentity(identity);
        return this;
    }

    /**
     * Invalidates the current identity of the CanisterWrapper instance.
     *
     * @returns {CanisterWrapper} - Returns the current instance of CanisterWrapper for chaining.
     */
    invalidateIdentity(): CanisterWrapper {
        this.agent.invalidateIdentity();
        return this;
    }
}
