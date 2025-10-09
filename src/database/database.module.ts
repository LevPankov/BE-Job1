import { Module } from "@nestjs/common";
import { KyselyProvider } from "./database.provider";

@Module({
    providers: [KyselyProvider],
    exports: [KyselyProvider],
})

export class DatabaseModule {}