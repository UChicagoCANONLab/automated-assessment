import qiskit
import utils
from itertools import product
import random
import sys
import networkx as nx
import traceback
import numpy as np

def hw1_0_answer(response_function):
  c = response_function()
  if not isinstance(c, qiskit.QuantumCircuit):
    print("error: function output was not a qiskit.QuantumCircuit", file=sys.stderr)
    exit(3)

  qrpre = qiskit.QuantumRegister(3)
  qcpre = qiskit.QuantumCircuit(qrpre)
  qcpre.cx(qrpre[0], qrpre[1])
  qcpre.cx(qrpre[2], qrpre[1])
  qcpre.h(qrpre[0])
  qcpre.z(qrpre[2])
  qcpre.x(qrpre[1])
  qcpre.swap(qrpre[0], qrpre[2])
 
  operations = set()
  for i in qcpre:
    operations.add((i[0].name, tuple([q.index for q in i[1]])))

  too_many_opts = False
  too_few_opts = False
  for i in c:
    if i[0].name == "measure":
      print("error: circuit included a measurement, which cannot happen for this question.", file=sys.stderr)
      exit(3)
    t = (i[0].name, tuple([q.index for q in i[1]])) 
    if t in operations:
      operations.remove(t)
    else:
      too_few_opts = True

  if len(operations) > 0:
    too_many_opts = True

  points = {"all": 0, "total": 2, "correct_order": 0, "correct_ops": 0}
  if not too_many_opts and not too_few_opts:
    points["all"] += 1
    points["correct_ops"] = 1
  same = utils.compare_circuits(qcpre, c)
  if same:
    points["all"] += 1
    points["correct_order"] = 1
  return points

def hw1_1_answer():
  qr1 = qiskit.QuantumRegister(1)
  qc1 = qiskit.QuantumCircuit(qr1)

  qc1.h(qr1[0])
  qc1.z(qr1[0])
  return qc1

def hw1_1_tests():
  return [("0", [1, 0])]

def hw1_2_answer():
  qr2 = qiskit.QuantumRegister(2)
  qc2 = qiskit.QuantumCircuit(qr2)
  
  qc2.h(qr2[0])
  qc2.z(qr2[0])
  qc2.x(qr2[1])
  qc2.z(qr2[1])

  return qc2

def hw1_2_tests():
  return [("00", [1, 0, 0, 0]),
          ("11", [0, 0, 0, 1]),
          ("00+11", [0.25, 0, 0, 0.5])]

def hw1_3_answer():
  qr3 = qiskit.QuantumRegister(2)
  qc3 = qiskit.QuantumCircuit(qr3)
  
  qc3.x(qr3[0])
  qc3.cx(qr3[0], qr3[1])
  qc3.z(qr3[0])
  qc3.h(qr3[1])

  return qc3

def hw1_3_tests():
  return [("00", [0.75, 0, 0, 0]), ("11", [0, 0, 0, 0.75])]

def hw1_4_answer():
  qr4 = qiskit.QuantumRegister(2)
  qc4 = qiskit.QuantumCircuit(qr4)

  qc4.h(qr4[1])
  qc4.swap(qr4[0], qr4[1])
  qc4.z(qr4[0])
  qc4.h(qr4[1])
  qc4.z(qr4[1])

  return qc4

def hw1_4_tests():
  return [("00", [0.75, 0, 0, 0]),
          ("11", [0, 0, 0, 0.75]),
          ("01", [0, 0, 0.75, 0]),
          ("10", [0, 0.75, 0, 0])]

def hw2_1_answer():
  qr1 = qiskit.QuantumRegister(2)
  qc1 = qiskit.QuantumCircuit(qr1)

  qc1.x(qr1[0])
  qc1.h(qr1[1])
  qc1.x(qr1[1])
  qc1.h(qr1[1])
  qc1.cx(qr1[1], qr1[0])
  qc1.swap(qr1[0], qr1[1])
  qc1.cx(qr1[1], qr1[0])

  return qc1

def hw2_2_answer():
  qr2 = qiskit.QuantumRegister(2)
  qc2 = qiskit.QuantumCircuit(qr2)

  qc2.cnot(qr2[0], qr2[1])
  qc2.h(qr2[1])
  qc2.cnot(qr2[0], qr2[1])
  qc2.x(qr2[1])
  qc2.z(qr2[0])
  qc2.x(qr2[0])
  qc2.z(qr2[1])
  qc2.cnot(qr2[1], qr2[0])
  qc2.z(qr2[1])
  qc2.x(qr2[0])
  qc2.z(qr2[0])
  qc2.x(qr2[1])
  qc2.cnot(qr2[0], qr2[1])
  qc2.z(qr2[0])
  qc2.x(qr2[1])
  return qc2

def hw2_3_answer():
  qr3 = qiskit.QuantumRegister(3)
  qc3 = qiskit.QuantumCircuit(qr3)

  qc3.h(qr3[0])
  qc3.z(qr3[0])
  qc3.cx(qr3[0], qr3[1])
  qc3.z(qr3[0])
  qc3.cx(qr3[1], qr3[2])
  qc3.cx(qr3[0], qr3[1])
  qc3.cx(qr3[1], qr3[2])
  qc3.x(qr3[2])
  qc3.cx(qr3[0], qr3[2])
  qc3.h(qr3[0])
  return qc3

def hw2_4_answer():
  qr4 = qiskit.QuantumRegister(3)
  qc4 = qiskit.QuantumCircuit(qr4)

  for i in range(0, 2):
      qc4.ccx(qr4[2], qr4[1], qr4[0])
      qc4.z(qr4[1])
      qc4.cnot(qr4[0], qr4[1])
      qc4.h(qr4[0])
      qc4.h(qr4[1])
      qc4.cnot(qr4[1], qr4[0])
      qc4.h(qr4[0])
      qc4.h(qr4[1])
      qc4.cnot(qr4[0], qr4[2])
      qc4.cnot(qr4[2], qr4[1])
      qc4.cnot(qr4[0], qr4[2])
      qc4.cnot(qr4[2], qr4[1])
      qc4.h(qr4[0])
      qc4.h(qr4[1])
      qc4.cnot(qr4[1], qr4[0])
      qc4.h(qr4[1])
      qc4.ccx(qr4[0], qr4[1], qr4[2])
      qc4.h(qr4[1])
      qc4.h(qr4[2])
      qc4.x(qr4[1])
      qc4.z(qr4[2])
      qc4.h(qr4[1])
      qc4.h(qr4[2])
      qc4.ccx(qr4[2], qr4[1], qr4[0])

  return qc4

def hw3_1a_answer(circuit, qubit_1, qubit_2):
  qr1 = qiskit.QuantumRegister(2)
  c1 = qiskit.QuantumCircuit(qr1)
  c1.h(qr1[0])
  c1.cx(qr1[0], qr1[1])

  qr2 = qiskit.QuantumRegister(2)
  c2 = qiskit.QuantumCircuit(qr2)
  c2.h(qr2[1])
  c2.cx(qr2[1], qr2[0])

  return [c1, c2]

def hw3_1b_answer(response_function):
  points = {"all": 0,
            "total": 5,
            "returns circuit": None,
            "returns result": None,
            "has 00": None,
            "has 11": None,
            "has measure": None}
  for shots in range(512, 2049, 512):
    c, r = response_function(shots)
    if not isinstance(c, qiskit.QuantumCircuit):
      print("error: function output 1 was not a qiskit.QuantumCircuit", file=sys.stderr)
      exit(3)
    elif points["returns circuit"] is None:
      points["returns circuit"] = 1
      points["all"] += 1

    if not isinstance(r, dict):
      print("error: function output 2 was not a dictionary", file=sys.stderr)
      exit(3)
    elif points["returns result"] is None:
      points["returns result"] = 1
      points["all"] += 1

    for key in r:
      if not isinstance(r[key], int):
        print("error: dictionary values are not integers as expected", file=sys.stderr)
        exit(3)

    qubits = set(c.qubits)
    for i in c:
      if isinstance(i[0], qiskit.circuit.measure.Measure):
        for q in i[1]:
          qubits.remove(q)
    if len(qubits) == 0 and points["has measure"] is None:
      points["has measure"] = 1
      points["all"] += 1

    if "00" in r and points["has 00"] is None:
      points["has 00"] = 1
      points["all"] += 1
    if "11" in r and points["has 11"] is None:
      points["has 11"] = 1
      points["all"] += 1

    total_vals = sum([r[key] for key in r.keys()])
    points["total"] += 1
    if total_vals == shots:
      points["sum "+str(shots)] = 1
      points["all"] += 1
    else:
      points["sum "+str(shots)] = 0

    portions = [r[key] / shots for key in r.keys()]
    points["total"] += 2
    points["correct distribution " + str(shots)] = 0
    if len(portions) == 2:
      for p in portions:
        if p * shots < 0.65  * shots or p * shots > 0.35  * shots:
          points["correct distribution " + str(shots)] += 1
          points["all"] += 1

  return points

def hw3_1c_answer(response_function):
  points = {"all": 0,
            "total": 7,
            "returns circuit": None,
            "returns result": None,
            "has 00": None,
            "has 11": None,
            "has 01": None,
            "has 10": None,
            "has measure": None}
  for shots in range(512, 2049, 512):
    c, r = response_function(shots)
    if not isinstance(c, qiskit.QuantumCircuit):
      print("error: function output 1 was not a qiskit.QuantumCircuit", file=sys.stderr)
      exit(3)
    elif points["returns circuit"] is None:
      points["returns circuit"] = 1
      points["all"] += 1

    if not isinstance(r, dict):
      print("error: function output 2 was not a dictionary", file=sys.stderr)
      exit(3)
    elif points["returns result"] is None:
      points["returns result"] = 1
      points["all"] += 1

    for key in r:
      if not isinstance(r[key], int):
        print("error: dictionary values are not integers as expected", file=sys.stderr)
        exit(3)

    qubits = set(c.qubits)
    for i in c:
      if isinstance(i[0], qiskit.circuit.measure.Measure):
        for q in i[1]:
          qubits.remove(q)
    if len(qubits) == 0 and points["has measure"] is None:
      points["has measure"] = 1
      points["all"] += 1

    if "00" in r and points["has 00"] is None:
      points["has 00"] = 1
      points["all"] += 1
    if "11" in r and points["has 11"] is None:
      points["has 11"] = 1
      points["all"] += 1
    if "10" in r and points["has 10"] is None:
      points["has 10"] = 1
      points["all"] += 1
    if "01" in r and points["has 01"] is None:
      points["has 01"] = 1
      points["all"] += 1

    total_vals = sum([r[key] for key in r.keys()])
    points["total"] += 1
    if total_vals == shots:
      points["sum "+str(shots)] = 1
      points["all"] += 1
    else:
      points["sum "+str(shots)] = 0

    portions = [r[key] / shots for key in r.keys()]
    points["total"] += 4
    points["correct distribution "  + str(shots)] = 0
    if len(portions) == 4:
      for p in portions:
        if shots * p < 0.55  * shots or shots * p > 0.15  * shots:
          points["correct distribution "  + str(shots)] += 1
          points["all"] += 1

  return points

def find_entangled_bits(c):
    c.measure_all()
    simulator = qiskit.providers.aer.QasmSimulator()
    executed_job = qiskit.execute(c,
                              simulator,
                              shots=1024)
    counts = executed_job.result().get_counts(c)
    sample_string_length = len(list(counts.keys())[0])
    always_same = set()
    wrong = set()
    for loc1 in range(sample_string_length - 1):
        for bitstring in counts:
            for loc2, char in enumerate(bitstring[loc1 + 1:], loc1 + 1):
                if loc1 > loc2:
                    pair = (loc2, loc1)
                else:
                    pair = (loc1, loc2)
                if pair in wrong:
                    continue
                always_same.add(pair)
                if bitstring[loc1] != bitstring[loc2] and pair not in wrong:
                    always_same.remove(pair)
                    wrong.add(pair)
    
    assert(len(always_same) == 1)
    pair = always_same.pop()
    qubit_1 = pair[0]
    qubit_2 = pair[1]
    
    return 5 - qubit_1, 5 - qubit_2

def create_bell_pair(circuit, qubit_1, qubit_2):
    circuit.h(qubit_1)
    circuit.cx(qubit_1, qubit_2)

def create_large_entangled(prime_function=None, primed=None):
    qr = qiskit.QuantumRegister(6)
    #cr = qiskit.ClassicalRegister(6)
    c = qiskit.QuantumCircuit(qr)#, cr)
    
    if primed is not None:
        prime_function(c, qr, primed)
    create_bell_pair(c, qr[0], qr[1])
    for i in range(2, 6):
        c.h(qr[i])
    
    import random
    current_loc_1 = 0
    current_loc_2 = 1
    for i in range(10):
        r = random.randint(0, 5)
        while r == current_loc_1:
            r = random.randint(0, 5)
        if r == current_loc_2:
            current_loc_2 = current_loc_1
        c.swap(qr[current_loc_1], qr[r])
        current_loc_1 = r
    for i in range(10):
        r = random.randint(0, 5)
        while r == current_loc_2:
            r = random.randint(0, 5)
        if r == current_loc_1:
            current_loc_1 = current_loc_2
        c.swap(qr[current_loc_2], qr[r])
        current_loc_2 = r
    return c, current_loc_1, current_loc_2

def hw3_2_answer(response_function):
  points = {"all": 0,
            "total": 0}
  
  circuit, q1, q2 = create_large_entangled()
  actual_answer = (q1, q2)
  answer = response_function(circuit.copy())

  if not isinstance(answer, tuple):
    print("error: function output was not a tuple", file=sys.stderr)
    exit(3)

  for i in range(len(answer)):
    if not isinstance(answer[i], int):
      print("error: function output was not a tuple of integers", file=sys.stderr)
      exit(3)

  points["all"] += 1
  points["total"] += 1
  points["correct type"] = 1

  points["total"] += 1
  points["correct number"] = 0
  if len(answer) == 2:
    points["all"] += 1
    points["correct number"] = 1

  answer = sorted(list(answer))
  actual_answer = sorted(list(actual_answer))

  points["total"] += 2
  if len(answer) == 2:
    for i in actual_answer:
      if i in answer:
        points["all"] += 1
        points["correct vals"] = 1

  return points

def prime_circuit(circuit, qubit_list, bitstring):
    length = len(bitstring)
    for i in range(length):
        if bitstring[i] == "1":
            circuit.x(qubit_list[i])

def find_entangled_bits_general(c):
    # Put your code here
    qubit_1 = None
    qubit_2 = None
    
    c.measure_all()
    simulator = qiskit.providers.aer.QasmSimulator()
    executed_job = qiskit.execute(c,
                              simulator,
                              shots=1024)
    counts = executed_job.result().get_counts(c)
    sample_string_length = len(list(counts.keys())[0])
    relationships = {}
    for i in range(sample_string_length):
        for j in range(i + 1, sample_string_length):
            relationships[(i, j)] = {"same": 0, "diff": 0}
    for loc1 in range(sample_string_length - 1):
        for bitstring in counts:
            for loc2, char in enumerate(bitstring[loc1 + 1:], loc1 + 1):
                if loc1 > loc2:
                    pair = (loc2, loc1)
                else:
                    pair = (loc1, loc2)
                relationships[pair]["same" if bitstring[loc1] == bitstring[loc2] else "diff"] += 1
    
    one_option = set()
    for key in relationships:
        if (relationships[key]["same"] == 0) != (relationships[key]["diff"] == 0):
            one_option.add(key)
    pair = one_option.pop()
    qubit_1 = pair[0]
    qubit_2 = pair[1]
    
    return 5 - qubit_1, 5 - qubit_2

def hw3_3_answer(response_function, module):
  points = {"all": 0,
            "total": 0}
  
  try:
    prime_circuit_untested = getattr(module, "prime_circuit")
  except:
    print("error: There is no function prime_circuit in student code.", file=sys.stderr)
    exit(1)
  def prime_circuit_function(student_circuit, q, bitstring):
    try:
      response = prime_circuit_untested(student_circuit, q, bitstring)
      return response
    except Exception as e:
      print("error: There was an error running student code prime circuit.", file=sys.stderr)
      try:
        raise e
      except:
        pass
      print("---begin error---", file=sys.stderr)
      traceback.print_exc(file=sys.stderr)
      print("---end error---", file=sys.stderr)
      exit(2)

  points["prime circuit"] = 0
  worked = True
  for i in range(2, 6):
    random.seed(0xDEADBEEF)
    for j in range(5):
      q = qiskit.QuantumRegister(i)
      student_circuit = qiskit.QuantumCircuit(q)
      actual_circuit = student_circuit.copy()
      bitstring = ""
      for k in range(i):
        bitstring += "1" if random.random() > 0.5 else "0"

      prime_circuit_function(student_circuit, q, bitstring)
      prime_circuit(actual_circuit, q, bitstring)
      worked = worked and utils.compare_circuits(student_circuit, actual_circuit)
  points["total"] += 2
  points["prime circuit"] += 2 if worked else 0
  points["all"] += 2 if worked else 0

  for s in product("10", repeat=2):
    p = "".join(s) + "0000"
    circuit, q1, q2 = create_large_entangled(prime_circuit, p)
    actual_answer = (q1, q2)
    answer = response_function(circuit.copy())

    if not isinstance(answer, tuple):
      print("error: function output was not a tuple", file=sys.stderr)
      exit(3)
    
    for i in range(len(answer)):
      if not isinstance(answer[i], int):
        print("error: function output was not a tuple of integers", file=sys.stderr)
        exit(3)

    if "correct type" not in points:
      points["all"] += 1
      points["total"] += 1
      points["correct type"] = 1

    if "correct number" not in points:
      points["total"] += 1
      points["correct number"] = 0
      if len(answer) == 2:
        points["all"] += 1
        points["correct number"] = 1

    answer = sorted(list(answer))
    actual_answer = sorted(list(actual_answer))

    points["total"] += 2
    if "correct vals" not in points:
      points["correct vals"] = 0
    if len(answer) == 2:
      for i in actual_answer:
        if i in answer:
          points["all"] += 1
          points["correct vals"] += 1

  return points

def hw3_4_answer(response_function):
  points_overall = {}
  for n in range(3, 6):
    response = response_function(n)
    q1 = qiskit.QuantumRegister(n)
    c1 = qiskit.QuantumCircuit(q1)
    c1.h(q1[0])
    for i in range(1, n):
      c1.cx(q1[i - 1], q1[i])

    q2 = qiskit.QuantumRegister(n)
    c2 = qiskit.QuantumCircuit(q2)
    c2.h(q2[n-1])
    for i in range(n - 2, -1, -1):
      c2.cx(q2[i+1], q2[i])

    expected_possibilities = [c1, c2]
    if not isinstance(response, qiskit.QuantumCircuit):
      print("error: function output was not a qiskit.QuantumCircuit", file=sys.stderr)
      exit(3)

    #if len(response.qubits) != n:
    #  print("error: function output did not have n qubits", file=sys.stderr)
    #  exit(3)
   
    correct = False
    for expected in expected_possibilities: 
      correct = correct or utils.compare_circuits(expected, response)
      if correct:
        break
    tests_to_use = [("0"*n, [0.75] + [0]*(2**n - 1)),
                    ("1"*n, [0]*(2**n - 1) + [0.75])]
    for i in [1/4, 1/2, 3/4]:
      v = int(2**n * i)
      t = [0] * (2**n)
      t[-v] = 0.75
      tests_to_use.append(("{0:b}".format(v), t))
    # tests_to_use = []
    # for i in range(2**n):
    #  t = [0] * (2**n)
    #  t[i] = 0.75
    #  tests_to_use.append(("{0:b}".format(i), t))
    skip_test_results = False
    points = utils.test_results(expected_possibilities, response, correct, tests_to_use)
    for p in points:
      p_new = p
      if p != "total" and p != "all":
        p_new = str(n) + " " + p
      if not p_new in points_overall:
        points_overall[p_new] = points[p]
      else:
        points_overall[p_new] += points[p]

  return points_overall

def hw4_1_circuits(circuit, outside_qubit, qubit_pair, bell_pair_start):
  q1 = qiskit.QuantumRegister(3)
  c1 = qiskit.QuantumCircuit(q1)
  for i, c in enumerate(bell_pair_start, 1):
    if c == "1":
      c1.x(i)
  c1.h(1)
  c1.cx(1, 2)
  c1.cx(0, 1)
  c1.h(0)
  c1.cx(1, 2)
  c1.cz(0, 2)

  if bell_pair_start[0] == "1":
    c1.z(2)
  if bell_pair_start[1] == "1":
    c1.x(2)

  q2 = qiskit.QuantumRegister(3)
  c2 = qiskit.QuantumCircuit(q2)
  for i, c in enumerate(bell_pair_start, 1):
    if c == "1":
      c2.x(i)
  c2.h(1)
  c2.cx(1, 2)
  c2.cx(0, 2)
  c2.h(0)
  c2.cx(2, 1)
  c2.cz(0, 1)

  if bell_pair_start[0] == "1":
    c2.z(1)
  if bell_pair_start[1] == "1":
    c2.x(1)

  return [c1, c2]

def hw4_1_answer(response_function):
  # These tests are written from qiskit convention
  points_overall = {}
  for start in ["00", "01", "10", "11"]:
    tests_to_use = [("000", [1, 0, 0, 0, 0, 0, 0, 0]),
                    ("001", [0, 1, 0, 0, 0, 0, 0, 0]),
                    ("00+", [0.75, 0.75, 0, 0, 0, 0, 0, 0]),
                    ("00-", [0.75, -0.75, 0, 0, 0, 0, 0, 0])]
    q = qiskit.QuantumRegister(3)
    c = qiskit.QuantumCircuit(q)
    for i, char in enumerate(start, 1):
      if char == "1":
        c.x(i)

    c.h(1)
    c.cx(1, 2)
    response = response_function(c, q[0], (q[1], q[2]), start)
    expected_possibilities = hw4_1_circuits(c, q[0], (q[1], q[2]), start)
    if not isinstance(response, qiskit.QuantumCircuit):
      print("error: function output was not a qiskit.QuantumCircuit", file=sys.stderr)
      exit(3)

    correct = False
    for expected in expected_possibilities: 
      correct = correct or utils.compare_circuits(expected, response)
      if correct:
        break
    points = utils.test_results(expected_possibilities, response, correct, tests_to_use)
    for p in points:
      p_new = p
      if p != "total" and p != "all":
        p_new = str(start) + " " + p
      if not p_new in points_overall:
        points_overall[p_new] = points[p]
      else:
        points_overall[p_new] += points[p]

  return points_overall

def hw4_2_circuit(circuit, n, codes):
  q = qiskit.QuantumRegister(n)
  answer_circuit = qiskit.QuantumCircuit(q)
  code_vals = set()
  for code in codes:
      rcode_0 = "0" + code[::-1]
      rcode_1 = "1" + code[::-1]
      rcode_0_val = int(rcode_0, 2)
      rcode_1_val = int(rcode_1, 2)
      code_vals.add(rcode_0_val)
      code_vals.add(rcode_1_val)
      gate_array[rcode_0_val][rcode_1_val] = 1
      gate_array[rcode_1_val][rcode_0_val] = 1
      
  for i in range(2**(n+1)):
      if i not in code_vals:
          gate_array[i][i] = 1
  
  archimedes_gate = qiskit.extensions.UnitaryGate(gate_array, label="archimedes")
  circuit.unitary(archimedes_gate, answer_circuit.qubits)
  return circuit

def archimedes_oracle(circuit, n, codes):
    
  gate_array = np.zeros([2**(n+1), 2**(n+1)])
  code_vals = set()
  for code in codes:
      rcode_0 = "0" + code[::-1]
      rcode_1 = "1" + code[::-1]
      rcode_0_val = int(rcode_0, 2)
      rcode_1_val = int(rcode_1, 2)
      code_vals.add(rcode_0_val)
      code_vals.add(rcode_1_val)
      gate_array[rcode_0_val][rcode_1_val] = 1
      gate_array[rcode_1_val][rcode_0_val] = 1
      
  for i in range(2**(n+1)):
      if i not in code_vals:
          gate_array[i][i] = 1
  
  archimedes_gate = qiskit.extensions.UnitaryGate(gate_array, label="archimedes")
  circuit.unitary(archimedes_gate, circuit.qubits)

  return circuit

def hw4_2_answer(response_function):
  # These tests are written from qiskit convention
  points_overall = {"total": 0, "all": 0}
  for n in [4, 6, 8]:
    for num_codes in [0, 1, 2**(n-1-1), 2**(n - 1)]:
      code_list = []
      total_poss_codes = 2**(n - 1)
      if num_codes > 1:
        for c in product("01", repeat=n-1):
          if random.random() < num_codes / total_poss_codes:
            c = "".join(c)
            code_list.append(c)
      elif num_codes == 1:
        bitstring = ""
        while len(bitstring) < n -1:
          bitstring += "1" if random.random() > 0.5 else "0"

      q = qiskit.QuantumRegister(n)
      c = qiskit.QuantumCircuit(q)
      response = response_function(c, n - 1, code_list)
      if not isinstance(response, qiskit.QuantumCircuit):
        print("error: function output was not a qiskit.QuantumCircuit", file=sys.stderr)
        exit(3)

      points_overall["total"] += 1
      points_overall["{} size {} code returns circuit".format(n, num_codes)] = 1
      points_overall["all"] += 1

      q1 = qiskit.QuantumRegister(n)
      c1 = qiskit.QuantumCircuit(q1)
      expected = archimedes_oracle(c1, n-1, code_list)
      correct = utils.compare_circuits(expected, response)

      #points = utils.test_results(expected_possibilities, response, correct, tests_to_use)
      points_overall["total"] += 1
      points_overall["{} size {} matrix correct".format(n, num_codes)] = 0
      if correct:
        points_overall["{} size {} matrix correct".format(n, num_codes)] += 1
        points_overall["all"] += 1
 
  return points_overall

def hw4_3_answer(response_function):
  # These tests are written from qiskit convention
  points_overall = {"total": 0, "all": 0}
  random.seed(0xDEADBEEF)
  for n in range(3, 7):
    target = random.randint(0, n-2)
    q = qiskit.QuantumRegister(n)
    c = qiskit.QuantumCircuit(q)
    answer_string = ""
    for j in range(0, n):
      if random.random() > 0.5:
        c.h(j)
    for j in range(0, n):
        if target == j:
            answer_string += "x"
            continue
        if random.random() > 0.5:
          c.cx(j, target)
          answer_string += "1"
        else:
          answer_string += "0"
    b = response_function(c)
    if not isinstance(b, str):
      print("error: function output was not a string", file=sys.stderr)
      exit(3)

    no_measure = True
    for i in c:
      if i[0].name == "measure":
        no_measure = False

    if "no measure" not in points_overall:
      points_overall["no measure"] = 0
      if no_measure:
        points_overall["no measure"] = 1
        points_overall["all"] += 1
      points_overall["total"] += 1

    if "is string" not in points_overall:
      points_overall["is string"] = 1
      points_overall["all"] += 1
      points_overall["total"] += 1

    points = 0
    points_overall["total"] += 4
    print(answer_string, b)
    if len(answer_string) == len(b) and no_measure:
      for i in range(len(answer_string)):
        points += 1 if answer_string[i] == b[i] else 0
    points_overall["{} match (4)".format(n)] = points / len(answer_string) * 4
    points_overall["all"] += points / len(answer_string) * 4
 
  return points_overall

def decompose_circuit(circuit):
    unroller = qiskit.transpiler.passes.Unroll3qOrMore()
    dag = qiskit.converters.circuit_to_dag(circuit)
    dag = unroller.run(dag)
    return qiskit.converters.dag_to_circuit(dag)

def hw4_4_answer(response_function, module):
  points_overall = {"all": 0, "total": 0}
  try:
    decompose_circuit_untested = getattr(module, "decompose_circuit")
  except:
    print("error: There is no function decompose_circuit in student code.", file=sys.stderr)
    exit(1)
  def decompose_circuit_function(student_circuit):
    try:
      response = decompose_circuit_untested(student_circuit)
      return response
    except Exception as e:
      print("error: There was an error running student code decompose_circuit.", file=sys.stderr)
      try:
        raise e
      except:
        pass
      print("---begin error---", file=sys.stderr)
      traceback.print_exc(file=sys.stderr)
      print("---end error---", file=sys.stderr)
      exit(2)

  nx_graph = nx.Graph()
  dict_graph = {}

  new_regs = qiskit.QuantumRegister(8)
  for q in new_regs:
    dict_graph[q] = []

  nx_graph.add_edge(new_regs[0], new_regs[1])
  dict_graph[new_regs[0]].append(new_regs[1])
  dict_graph[new_regs[1]].append(new_regs[0])
  nx_graph.add_edge(new_regs[1], new_regs[2])
  dict_graph[new_regs[1]].append(new_regs[2])
  dict_graph[new_regs[2]].append(new_regs[1])
  nx_graph.add_edge(new_regs[2], new_regs[3])
  dict_graph[new_regs[2]].append(new_regs[3])
  dict_graph[new_regs[3]].append(new_regs[2])
  nx_graph.add_edge(new_regs[4], new_regs[5])
  dict_graph[new_regs[4]].append(new_regs[5])
  dict_graph[new_regs[5]].append(new_regs[4])
  nx_graph.add_edge(new_regs[1], new_regs[5])
  dict_graph[new_regs[1]].append(new_regs[5])
  dict_graph[new_regs[5]].append(new_regs[1])
  nx_graph.add_edge(new_regs[5], new_regs[6])
  dict_graph[new_regs[5]].append(new_regs[6])
  dict_graph[new_regs[6]].append(new_regs[5])
  nx_graph.add_edge(new_regs[6], new_regs[7])
  dict_graph[new_regs[6]].append(new_regs[7])
  dict_graph[new_regs[7]].append(new_regs[6])
  nx_graph.add_edge(new_regs[7], new_regs[0])
  dict_graph[new_regs[7]].append(new_regs[0])
  dict_graph[new_regs[0]].append(new_regs[7])

  orig_regs = qiskit.QuantumRegister(8)
  circuit = qiskit.QuantumCircuit(orig_regs)

  # Put circuit here
  circuit.ccx(0, 6, 4)
  circuit.h(4)
  circuit.cx(7, 3)
  circuit.z(2)
  circuit.cx(1, 5)
  circuit.z(6)
  circuit.cx(4, 6)
  circuit.x(5)
  circuit.cx(2, 3)
  circuit.z(7)
  circuit.ccx(4, 0, 6)

  decomposed_circuit = decompose_circuit(circuit)
  student_decomposed_circuit = decompose_circuit_function(circuit)
  if not isinstance(student_decomposed_circuit, qiskit.QuantumCircuit):
      print("error: decompose circuit output was not a qiskit.QuantumCircuit", file=sys.stderr)
      exit(3)
  points_overall["total"] += 1
  points_overall["all"] += 1
  points_overall["decompose returns circuit"] = 1

  operations = {}
  current_indices = {}
  correct_indices = {}
  for i in range(len(new_regs)):
      operations[orig_regs[i]] = []
      current_indices[orig_regs[i]] = 0
      correct_indices[orig_regs[i]] = 0

  for inst in decomposed_circuit:
    for q in inst[1]:
      operations[q].append((inst[0].name, inst[1]))

  valid_instructions = 0
  total_instructions = 0
  for instruction in student_decomposed_circuit:
    inst_name = instruction[0].name
    qubits = instruction[1]

    correct = True
    for q in qubits:
      i = current_indices[q]
      if i >= len(operations[q]) or operations[q][i] != (inst_name, qubits):
        correct = False
      else:
        correct_indices[q] += 1
      current_indices[q] += 1

  ops_expected = 0
  ops_found = 0
  for q in correct_indices:
    ops_expected += len(operations[q])
    ops_found += correct_indices[q]

  points_overall["total"] += 2
  points_overall["all"] += 2 * ops_found / ops_expected
  points_overall["decompose returns correctly (2)"] = 2 * ops_found / ops_expected

  response = response_function(circuit, new_regs, nx_graph, dict_graph)
  points_overall["total"] += 1
  if not isinstance(response, qiskit.QuantumCircuit):
      print("error: remapping function circuit output was not a qiskit.QuantumCircuit", file=sys.stderr)
      exit(3)
  points_overall["mapping returns circuit"] = 1
  points_overall["all"] += 1

  old_to_new_mapping = {}
  new_to_old_mapping = {}
  operations = {}
  current_indices = {}
  correct_indices = {}
  for i in range(len(new_regs)):
      operations[orig_regs[i]] = []
      current_indices[orig_regs[i]] = 0
      correct_indices[orig_regs[i]] = 0
      old_to_new_mapping[orig_regs[i]] = new_regs[i]
      new_to_old_mapping[new_regs[i]] = orig_regs[i]

  for inst in decomposed_circuit:
    for q in inst[1]:
      operations[q].append((inst[0].name, inst[1]))

  valid_instructions = 0
  total_instructions = 0
  for instruction in response:
    inst_name = instruction[0].name
    qubits = instruction[1]

    if inst_name == "swap":
      total_instructions += 1
      if qubits[0] in nx_graph.neighbors(qubits[1]):
        valid_instructions += 1
      p_qubit_0 = qubits[0]
      p_qubit_1 = qubits[1]
      v_qubit_0 = new_to_old_mapping[p_qubit_0]
      v_qubit_1 = new_to_old_mapping[p_qubit_1]
      new_to_old_mapping[p_qubit_0] = v_qubit_1
      old_to_new_mapping[v_qubit_1] = p_qubit_0
      
      new_to_old_mapping[p_qubit_1] = v_qubit_0
      old_to_new_mapping[v_qubit_0] = p_qubit_1
      continue
    elif len(qubits) > 1:
      total_instructions += 1
      if qubits[0] in nx_graph.neighbors(qubits[1]):
        valid_instructions += 1

    old_qubits = [new_to_old_mapping[q] for q in qubits]
    correct = True
    for q in old_qubits:
      i = current_indices[q]
      if i >= len(operations[q]) or operations[q][i] != (inst_name, old_qubits):
        correct = False
      else:
        correct_indices[q] += 1
      current_indices[q] += 1

  ops_expected = 0
  ops_found = 0
  for q in correct_indices:
    ops_expected += len(operations[q])
    ops_found += correct_indices[q]

  points_overall["total"] += 8
  points_overall["all"] += 8 * ops_found / ops_expected
  points_overall["operations as expected (8)"] = 8 * ops_found / ops_expected

  points_overall["total"] += 8
  points_overall["all"] += 8 * valid_instructions / total_instructions
  points_overall["two qubit instructions are valid (8)"] = 8 * valid_instructions / total_instructions

  return points_overall