import { Global, Module } from "@nestjs/common";
import { KyselyProvider } from "./database.provider";

@Global()
@Module({
    providers: [KyselyProvider],
    exports: [KyselyProvider],
})

export class DatabaseModule {}