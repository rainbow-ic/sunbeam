import { Agent } from ".";

export type CanisterWrapperInitArgs = { id: string; agent: Agent };

export class CanisterWrapper {
    protected id: string;
    protected agent: Agent;

    constructor({ id, agent }: CanisterWrapperInitArgs) {
        this.id = id;
        this.agent = agent;
    }
}
