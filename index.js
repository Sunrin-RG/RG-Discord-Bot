const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();

// 설정 불러오기
const { prefix } = require("./config.json");
const permissions = require("./permissions.json");

// 명령어 파일 불러오기
client.commands = new Discord.Collection();
const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // 비활성화 된 명령어 제외
    if (command.disable) {
        console.log(`[-] Command disabled: ${file}`);
        continue;
    }
    console.log(`[+] Command activated: ${file}`);
    client.commands.set(command.name, command);
}

client.on("ready", () => {
    // 활동 설정하기
    client.user.setActivity("RG: Republic of Game");

    console.log(`[!] Discord logged in ${client.user.tag}!`);
});

client.on("message", (message) => {
    // 비 명령 채팅 및 봇 채팅 제외
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // 명령 구문 분리
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    // 명령 목록 확인
    const command =
        client.commands.get(commandName) ||
        client.commands.find(
            (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
        );
    if (!command) return;

    // 유저 검사
    if (true) {
        // 아이디 검사
        if (
            permissions[command.name].users &&
            permissions[command.name].users.length
        ) {
            if (!permissions[command.name].users.includes(message.member.id)) {
                return message.reply(
                    `\`${prefix}${command.name}\` 명령을 실행할 권한이 없습니다!`
                );
            }
        }

        // 역할 검사
        if (
            permissions[command.name].roles &&
            permissions[command.name].roles.length
        ) {
            var hasPermission = false;
            for (let role in permissions[command.name].roles) {
                if (
                    message.member.roles.cache.some(
                        (userRole) =>
                            userRole.id ===
                            permissions[command.name].roles[role]
                    )
                ) {
                    hasPermission = true;
                    break;
                }
            }
            if (!hasPermission) {
                return message.reply(
                    `\`${prefix}${command.name}\` 명령을 실행할 권한이 없습니다!`
                );
            }
        }
    }

    // 카테고리 검사
    if (
        permissions[command.name].categories &&
        permissions[command.name].categories.length
    ) {
        if (
            !permissions[command.name].categories.includes(
                message.channel.parentID
            )
        ) {
            return message.reply(
                `\`${message.channel.parent.name}\` 카테고리에서는 \`${prefix}${command.name}\` 명령을 실행할 수 없습니다!`
            );
        }
    }
    // 채널 검사
    if (
        permissions[command.name].channels &&
        permissions[command.name].channels.length
    ) {
        if (!permissions[command.name].channels.includes(message.channel.id)) {
            return message.reply(
                `\`${message.channel.name}\` 채널에서는 \`${prefix}${command.name}\` 명령을 실행할 수 없습니다!`
            );
        }
    }

    // 필수 인자 검사
    if (command.args && args.length < command.args) {
        return message.reply(
            `명령어 실행에 필요한 인자가 부족합니다!\n` +
                `사용법: \`${prefix}${command.name} ${command.usage}\``
        );
    }

    // 명령어 실행
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(`[!] Command error > ${error}`);
        message.reply(
            "명령을 실행하는 도중 예기치 않은 문제가 발생했습니다 :("
        );
    }
});

module.exports = {
    getUserFromMention: function (mention) {
        const matches = mention.match(/^<@!?(\d+)>$/);
        if (!matches) return;

        const id = matches[1];
        return client.users.cache.get(id);
    },
    getCommandUsageFromName: function (commandName) {
        var usage = "";

        const command =
            client.commands.get(commandName) ||
            client.commands.find(
                (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
            );
        if (!command) return;

        usage += `\`${prefix}${command.name} ${command.usage}\`\n`;
        if (command.aliases && command.aliases.length) {
            usage += "별명: `";
            for (var alias in command.aliases) {
                usage += `${prefix}${command.aliases[alias]}${
                    alias != command.aliases.length - 1 ? ", " : ""
                }`;
            }
            usage += "`\n";
        }
        usage += `\`\`\`${command.description}\`\`\`\n`;

        return usage;
    },
};

// 디스코드 로그인
require("dotenv").config();
client.login(process.env.TOKEN);
