import {
  Controller,
  Get,
  Req,
  UseGuards,
  Logger,
  Body,
  Post,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { ChatService } from './chat.service';
import { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { Chatroom, Message } from '@prisma/client';
import { ChatDto } from './chat.dto';
import { User } from '@prisma/client';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}
  logger: Logger = new Logger('ChatController');

  @UseGuards(JwtAuthGuard)
  @Get('convo')
  async getConvo(@Req() req: Request, @Query() query) {
    if (query.id == null) {
      return [];
    }
    const messages = await this.chatService.getMessages(
      Number(query.id),
      req.user.toString(),
    );
    return messages;
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-channel')
  async createChannelsReq(@Req() request: Request, @Body() body: ChatDto) {
    let channel = await this.chatService.createChannel(body, request);
    return channel;
  }

  @UseGuards(JwtAuthGuard)
  @Get('channels')
  async getChannelsReq(@Req() request: Request) {
    let channels = await this.chatService.getChannels(request);
    return channels;
  }

  @UseGuards(JwtAuthGuard)
  @Post('join-channel')
  async joinChannelReq(@Req() request: Request) {
    let username = request.user.toString();
    let channel = request.body.value;
    let confirmation = await this.chatService.joinChannel(
      username,
      channel,
      false,
      false,
    );
    return confirmation;
  }

  @UseGuards(JwtAuthGuard)
  @Post('delete-channel')
  async removeChannelReq(@Req() request: Request) {
    if (!request.user || !request.body.value) {
      return false;
    }
    this.logger.debug(request.body.value, request.user.toString());
    const confirmation = await this.chatService.removeChannel(
      request.body.value,
      request.user.toString(),
    );
    return confirmation;
  }

  @UseGuards(JwtAuthGuard)
  @Get('public-channels')
  async getPublicReq(@Req() request: Request) {
    const confirmation = await this.chatService.getPublic(request);
    return confirmation;
  }
  @UseGuards(JwtAuthGuard)
  @Get('members')
  async roomMembers(@Req() request: Request, @Query() query) {
    const members = this.chatService.getMembers(Number(query.id));
    return members;
  }

  @UseGuards(JwtAuthGuard)
  @Get('join-password')
  async joinPassword(@Req() request: Request, @Query() query) {
    const confirm = await this.chatService.confirmPassword(
      Number(query.id),
      query.password,
      request.user.toString(),
    );
    if (confirm === true) {
      return 'confirmed';
    } else {
      throw new HttpException('Wrong password', HttpStatus.FORBIDDEN);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('friends')
  async friendList(@Req() request: Request) {
    const list = await this.chatService.getFriendList(request.user.toString());
    return list;
  }

  @UseGuards(JwtAuthGuard)
  @Get('is-admin')
  async isAdmin(@Query() query) {
    const confirmation = await this.chatService.getAdmin(
      query.username,
      Number(query.id),
    );
    return confirmation;
  }

  @UseGuards(JwtAuthGuard)
  @Post('give-admin')
  async giveAdmin(@Req() req) {
    if (!req.body.chatroom || !req.body.username) return false;
    const isAdmin = await this.chatService.getAdmin(
      req.user.toString(),
      req.body.chatroom,
    );
    if (isAdmin === true) {
      const confirmation = await this.chatService.giveAdmin(
        req.body.username,
        req.body.chatroom,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('ban')
  async banUser(@Req() req) {
    const username = req.user.toString();
    const target = req.body.username;
    const chatroom = req.body.chatroom;
    const time = req.body.time;
    if (!target || !username || !chatroom || !time) {
      return false;
    }
    const banRight = await this.chatService.validateRestriction(
      username,
      target,
      chatroom,
    );
    if (banRight === true) {
      const confirm = await this.chatService.giveRestriction(
        target,
        chatroom,
        'ban',
        time,
      );
      if (confirm === false) {
        return false;
      }
    }
    this.logger.debug('USER BANNED');
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Post('mute')
  async muteUser(@Req() req) {}

  @UseGuards(JwtAuthGuard)
  @Get('dm')
  async dmRequest(@Req() req, @Query() query) {
    const user = req.user.toString();
    const exist = await this.chatService.getDmId(user, query.target);
    if (!exist) {
      //create and join if dm doesnt exist
      const response = await this.chatService.createDm(user, query.target);
      return response;
    }
    return exist.id;
  }
}
