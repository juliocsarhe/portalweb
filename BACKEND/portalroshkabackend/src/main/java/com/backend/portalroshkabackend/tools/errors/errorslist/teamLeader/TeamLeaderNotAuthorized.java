package com.backend.portalroshkabackend.tools.errors.errorslist.teamLeader;

public class TeamLeaderNotAuthorized extends RuntimeException {
    public TeamLeaderNotAuthorized() {

        super("No esta autorizado para administrar esta solicitud");
    }
}
