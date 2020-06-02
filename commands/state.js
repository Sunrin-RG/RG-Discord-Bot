module.exports = {
    disable: false,
    name: "state",
    aliases: ["상태"],
    args: 2,
    usage: '<멘션> <"대기|진행|완료">',
    description: "면접 상태를 변경합니다.",
    help: true,
    execute(message, args) {
        const { getUserFromMention } = require("../index");

        const target = getUserFromMention(args[0]);
        if (!target) {
            return message.reply(
                `\`${args[0]}\` 문구는 올바른 형식의 멘션이 아닙니다!`
            );
        }
    },
};
