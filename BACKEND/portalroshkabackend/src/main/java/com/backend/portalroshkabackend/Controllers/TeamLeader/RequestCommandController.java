package com.backend.portalroshkabackend.Controllers.TeamLeader;

import com.backend.portalroshkabackend.DTO.th.request.RequestResponseDto;
import com.backend.portalroshkabackend.Services.TeamLeader.IRequestsCommandService;
import com.backend.portalroshkabackend.notification.NotificationService;
import com.backend.portalroshkabackend.notification.webSocket.events.NotificarSolicitudAprobadaEvent;
import com.backend.portalroshkabackend.notification.webSocket.events.NotificarSolicitudRechazadaEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/teamleader")
public class RequestCommandController {

    private final IRequestsCommandService requestsTeamLeaderService;
    private final NotificationService notificationService;

    @PostMapping("/users/requests/{idSolicitud}/accept")
    public ResponseEntity<RequestResponseDto> acceptRequest(@PathVariable int idSolicitud) {

        RequestResponseDto respuesta = requestsTeamLeaderService.acceptRequest(idSolicitud);

        NotificarSolicitudAprobadaEvent event = new NotificarSolicitudAprobadaEvent();
        notificationService.sendEvent(event);

        return ResponseEntity.ok(respuesta);
    }

    @PostMapping("/users/requests/{idSolicitud}/reject")
    public ResponseEntity<RequestResponseDto> rejectRequest(@PathVariable int idSolicitud) {

        RequestResponseDto respuesta = requestsTeamLeaderService.rejectRequest(idSolicitud);

        NotificarSolicitudRechazadaEvent event = new NotificarSolicitudRechazadaEvent();
        notificationService.sendEvent(event);

        return ResponseEntity.ok(respuesta);
    }

}