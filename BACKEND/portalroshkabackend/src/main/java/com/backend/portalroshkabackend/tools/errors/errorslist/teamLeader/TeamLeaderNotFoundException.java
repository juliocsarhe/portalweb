package com.backend.portalroshkabackend.tools.errors.errorslist.teamLeader;


public class TeamLeaderNotFoundException extends RuntimeException {
    public TeamLeaderNotFoundException() {
        super("Team leader no encontrado");
    }
}
