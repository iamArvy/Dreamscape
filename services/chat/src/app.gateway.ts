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
import { Logger } from '@nestjs/common';
import { AppService } from './app.service';

@WebSocketGateway({ cors: true })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('AppGateway');

  constructor(private readonly service: AppService) {}

  // handleConnection(client: Socket) {
  //   this.logger.log(`Client connected: ${client.id}`);
  // }
  handleConnection(client: Socket) {
    // try {
    // const token = client.handshake.auth.token; // or from headers
    // const payload = jwt.verify(token, process.env.JWT_SECRET);
    const payload = 1;
    // Attach user to socket
    client.data = payload;
    this.logger.log(`Client connected: ${client.id}`);
    // } catch (err) {
    //   client.disconnect();
    // }
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

    const message = await this.service.sendMessage(cid, user, text, rid);

    this.logger.log(`Message sent to ${payload.cid} by ${user}`);
    this.server.to(payload.cid).emit('newMessage', message);
  }

  // Send a message
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
    const message = await this.service.updateMessage(cid, mid, user, text);

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
    const message = await this.service.deleteMessage(user, mid, cid);

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
