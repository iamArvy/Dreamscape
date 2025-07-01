import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Logger, UseGuards } from '@nestjs/common';
import { MessageService } from 'src/message/service';
import { ParticipantService } from 'src/participant/service';
import { WsAuthGuard } from 'src/guards';
import { ClientGrpc } from '@nestjs/microservices';

@UseGuards(WsAuthGuard)
@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(@Inject('chat') private client: ClientGrpc) {}
  private messageService: AuthServiceClient;
  private participantService: AuthServiceClient;
  private logger = new Logger('ChatGateway');
  constructor(
    private readonly messageService: MessageService,
    private readonly participantService: ParticipantService,
  ) {}

  // handleConnection(client: Socket) {
  //   this.logger.log(`Client connected: ${client.id}`);
  // }
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Join a conversation (room)
  @SubscribeMessage('joinConversation')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() cid: string,
  ) {
    const uid: string = client.data as string;
    await this.participantService.getConversationParticipant(uid, cid);
    await client.join(cid);
    this.logger.log(`Client ${client.id} joined conversation ${cid}`);
    client.emit('joinedConversation', cid);
  }

  // Send a message
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      cid: string;
      text: string;
      rid?: string;
    },
  ) {
    const { cid, text, rid } = payload;
    const user: string = client.data as string;
    await this.participantService.getConversationParticipant(user, cid);
    const message = await this.messageService.sendMessage(cid, user, text, rid);
    this.logger.log(`Message sent to ${payload.cid} by ${user}`);
    this.server.to(payload.cid).emit('newMessage', message);
  }

  //Update a message
  @SubscribeMessage('updateMessage')
  async handleUpdateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      cid: string;
      text: string;
      mid: string;
    },
  ) {
    const { cid, text, mid } = payload;
    const user: string = client.data as string;
    await this.participantService.getConversationParticipant(user, cid);
    const message = await this.messageService.updateMessage(user, mid, text);

    this.logger.log(`Message Updated ${payload.cid} by ${user}`);
    this.server.to(payload.cid).emit('updateMessage', message);
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      cid: string;
      mid: string;
    },
  ) {
    const { cid, mid } = payload;
    const user: string = client.data as string;
    await this.participantService.getConversationParticipant(user, cid);
    const message = await this.messageService.deleteMessage(user, mid);
    this.logger.log(`Message Updated ${payload.cid} by ${user}`);
    this.server.to(payload.cid).emit('deleteMessage', message);
  }
  // Typing indicator
  // @SubscribeMessage('typing')
  // handleTyping(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() payload: { conversationId: string; senderId: string },
  // ) {
  //   client.to(payload.conversationId).emit('userTyping', payload);
  // }

  // @SubscribeMessage('stopTyping')
  // handleStopTyping(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() payload: { conversationId: string; senderId: string },
  // ) {
  //   client.to(payload.conversationId).emit('userStoppedTyping', payload);
  // }

  // Mark messages as seen
  // @SubscribeMessage('markAsSeen')
  // async handleMarkAsSeen(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody()
  //   payload: {
  //     conversationId: string;
  //     userId: string;
  //     lastMessageId: string;
  //   },
  // ) {
  //   await this.service.markMessageAsSeen(payload);

  //   this.server.to(payload.conversationId).emit('messageSeen', {
  //     userId: payload.userId,
  //     conversationId: payload.conversationId,
  //     lastMessageId: payload.lastMessageId,
  //   });
  // }
}
