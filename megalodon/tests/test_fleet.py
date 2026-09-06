"""Fleet SSH wrapper — verifies the exact ssh argv and safe handling.

These tests build commands and probe an unroutable host; they never open a real
session, so the suite stays hermetic.
"""
from megalodon.config import FleetConfig, SSHHost
from megalodon.fleet import Fleet, build_ssh_argv


def test_linux_argv_is_plain_ssh():
    h = SSHHost(name="ubuntu", hostname="10.0.0.5", user="tj", port=22, shell="bash")
    argv = build_ssh_argv(h, "uptime", connect_timeout=10)
    assert argv[0] == "ssh"
    assert "tj@10.0.0.5" in argv
    assert "BatchMode=yes" in argv          # never prompts for a password
    assert argv[-1] == "uptime"             # command passed as one argv element
    assert "-p" not in argv                 # default port omitted


def test_custom_port_and_key():
    h = SSHHost(name="kali", hostname="host.local", user="root", port=2222, key="/keys/id_ed25519")
    argv = build_ssh_argv(h, "id")
    assert "-p" in argv and "2222" in argv
    assert "-i" in argv and "/keys/id_ed25519" in argv


def test_windows_wraps_powershell():
    h = SSHHost(name="win", hostname="192.168.1.9", user="tj", shell="powershell")
    argv = build_ssh_argv(h, "Get-Process")
    assert argv[-1].startswith("powershell -NoProfile -NonInteractive -Command ")
    assert "Get-Process" in argv[-1]


def test_get_and_hosts_filtering():
    fleet = Fleet(FleetConfig(hosts=[
        SSHHost(name="a", hostname="a.local"),
        SSHHost(name="b", hostname="b.local", enabled=False),
    ]))
    assert fleet.get("a").hostname == "a.local"
    assert fleet.get("missing") is None
    assert [h.name for h in fleet.hosts()] == ["a"]              # disabled filtered out
    assert [h.name for h in fleet.hosts(include_disabled=True)] == ["a", "b"]


def test_run_against_unroutable_host_fails_cleanly():
    # 203.0.113.0/24 is TEST-NET-3 (RFC 5737): guaranteed non-routable.
    fleet = Fleet(FleetConfig(connect_timeout=1, hosts=[SSHHost(name="x", hostname="203.0.113.1")]))
    res = fleet.run(fleet.get("x"), "echo hi", timeout=8)
    assert res.ok is False
    assert res.host == "x"
    assert res.returncode != 0                                   # no exception, clean result
