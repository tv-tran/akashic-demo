import TeamType = require("./enum/TeamType");

class Player {

	id: string;

	teamType: TeamType;

	playing: boolean;

	joined: boolean;

}

export = Player;
