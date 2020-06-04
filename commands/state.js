module.exports = {
    disable: false,
    name: "state",
    aliases: ["상태"],
    args: 2,
    usage: ["<멘션> <대기|면접1|면접2|완료>"],
    description: "학생의 면접 상태를 변경합니다.",
    help: true,
    argToRole: {
        대기: "waiting",
        면접1: "interview_1",
        면접2: "interview_2",
        완료: "complete",
    },
    execute(message, args) {
        const { getUserFromMention } = require("../index");
        const roles = require("../roles.json");

        // 멘션 유효성 검사
        const target = message.guild.member(getUserFromMention(args[0]));
        if (!target) {
            return message.reply(
                `\`${args[0]}\` 문구는 올바른 형식의 멘션이 아닙니다!`
            );
        }

        // 역할 유효성 검사
        if (!this.argToRole[args[1]]) {
            return message.reply(
                `\`${args[1]}\` 상태는 정해진 상태에 없습니다!`
            );
        }

        // 다른 역할 지우기
        for (let name in this.argToRole) {
            if (
                args[1] != name &&
                target.roles.cache.some(
                    (role) => role.id == roles[this.argToRole[name]]
                )
            ) {
                target.roles.remove(roles[this.argToRole[name]]);
            }
        }

        // 역할 중복 검사
        if (
            target.roles.cache.some(
                (role) => role.id == roles[this.argToRole[args[1]]]
            )
        ) {
            return message.reply(
                `\`${target.username}\` 사용자는 이미 \`${args[1]}\` 상태입니다!`
            );
        }
        // 역할 추가
        target.roles.add(roles[this.argToRole[args[1]]]);
        switch (args[1]) {
            case "대기":
                message.channel.send(
                    `<@${target.id}> 학생이 \`대기실 > 전체\`로 이동되었습니다.`
                );
                break;
            case "진행1":
                message.channel.send(
                    `<@${target.id}> 학생이 \`면접 1실\`로 이동되었습니다.`
                );
                target.user.send(`면접이 \`면접 1실\`에서 시작되었습니다!`);
                break;
            case "진행2":
                message.channel.send(
                    `<@${target.id}> 학생이 \`면접 2실\`로 이동되었습니다.`
                );
                target.user.send(`면접이 \`면접 2실\`에서 시작되었습니다!`);
                break;
            case "완료":
                message.channel.send(
                    `<@${target.id}> 학생이 \`대기실 > 완료\`로 이동되었습니다.`
                );
                target.user.send(`면접이 종료되었습니다!\n수고하셨습니다 :D`);
                break;
        }
    },
};
