module.exports = {
    disable: false,
    name: "help",
    aliases: ["도움", "도움말"],
    args: 0,
    usage: ["[명령어]"],
    description: "명령어 목록와 사용 방법을 알려줍니다.",
    help: true,
    execute(message, args) {
        const { commands } = message.client;
        const { getCommandUsageFromName } = require("../index");

        if (args[0]) {
            var msg = getCommandUsageFromName(args[0]);
            if (msg) {
                message.channel.send(msg);
            } else {
                message.reply(
                    `\`${args[0]}\` 명령은 존재하지 않는 명령입니다!`
                );
            }
        } else {
            var helpMessage = "";
            commands.forEach((cmd) => {
                if (cmd.help) {
                    helpMessage += getCommandUsageFromName(cmd.name);
                }
            });
            message.channel.send(helpMessage);
        }
    },
};
