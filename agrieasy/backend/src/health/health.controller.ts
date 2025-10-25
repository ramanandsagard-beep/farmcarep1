import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get()
  root() {
    return { status: 'ok', name: 'FarmCare API' };
  }

  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
