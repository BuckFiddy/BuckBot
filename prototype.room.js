Room.prototype.getAvailableMiningPositions = function (room, spawn) {
    let sources = room.find(FIND_SOURCES);
    let minerPositions = 0;
    const terrain = Game.map.getRoomTerrain(room.name);
    sourceData = [];

    for (var i in sources) {
        let source = sources[i];
        
        for (var y = source.pos.y - 1; y <= source.pos.y + 1; y++) {
            for (var x = source.pos.x - 1; x <= source.pos.x + 1; x++) {
                if (terrain.get(x, y) != TERRAIN_MASK_WALL) {
                    var pos = new RoomPosition(x, y, room.name);
                    var ret = PathFinder.search(spawn.pos, pos, {
                        swampCost: 1
                    });

                    if (!ret.incomplete) {
                        minerPositions++;
                    }
                }
            }
        }
    }
    room.memory.availableMiningPositions = minerPositions;
};