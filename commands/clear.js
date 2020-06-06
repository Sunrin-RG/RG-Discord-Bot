module.exports = {
    disable: false,
    name: "clear",
    aliases: ["cls", "청소"],
    args: 1,
    usage: ["<개수: 1 이상 99 이하>"],
    description: "채팅 기록을 제거합니다.",
    help: true,
    execute(message, args) {
        args[0] = Number(args[0]);
        if (args[0] < 1) {
            return message.reply("`개수`는 `1`보다 커야됩니다!");
        } else if (args[0] > 99) {
            return message.reply("`개수`는 `100`보다 작아야됩니다!");
        }

        message.channel.messages
            .fetch({ limit: args[0] + 1 })
            .then((messages) =>
                messages.forEach((msg) => {
                    msg.delete();
                })
            );
    },
};
