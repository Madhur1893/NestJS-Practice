import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UserService } from 'src/users/providers/user.service';
import { HashingProvider } from './hashing.provider';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';

@Injectable()
export class SignInProvider {
  constructor(
    // Inject userService
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    // Inject hashingProvider
    private readonly hashingProvider: HashingProvider,

    // Injecting JWT service
    private readonly jwtService: JwtService,

    // Inject jwtConfiguration
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  public async signIn(signInDto: SignInDto) {
    // Find the user using email ID
    // Throw an exception if user not found
    const user = await this.userService.findOneByEmail(signInDto.email);

    // Compare the password to the has
    let isEqual: boolean = false;
    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare password',
      });
    }
    if (!isEqual) {
      throw new UnauthorizedException('Incorrect Password');
    }
    // // Send confirmation
    // return true;

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },

      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );
    return {
      accessToken,
    };
  }
}
